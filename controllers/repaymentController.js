const Loan = require('../models/loan');
const loanRepayment = require('../models/repayment');
const mongoose = require('mongoose');

exports.postLoanRepayment = (req, res, next) => {
    const userId = req.userId;
    const firstInstallment = req.body.amount;

    Loan.findOne({userId: userId, balance: { $gt: 0 } })
    .then(loanDoc => {
        if (!loanDoc) {
            const error = new Error(
                "You do not have an outstanding loan to repay"
            );
            error.statusCode = 404;
            throw error;
        };

        if (
            typeof firstInstallment !== "number" ||
            !Number.isFinite(firstInstallment) ||
            firstInstallment <= 0
        ) {
            const error = new Error(
                "Repayment amount must be a valid positive number"
            );
            error.statusCode = 400;
            throw error;
        };

       if (Math.round(firstInstallment * 100) !== firstInstallment * 100) {
            const error = new Error(
                "Repayment amount cannot have more than 2 decimal places"
            );
            error.statusCode = 400;
            throw error;
        };

        //const balance = loanDoc.balance;
        const repaymentAmount = Math.round(firstInstallment * 100);

        if(repaymentAmount > loanDoc.balance) {
            const error = new Error("Repayment amount cannot be greater than the outstanding balance");
            error.statusCode = 400;
            throw error;
        }
        const currentBalance = loanDoc.balance;
        const currentPayment = repaymentAmount;

        loanDoc.repay += currentPayment;
        loanDoc.balance = currentBalance - currentPayment;

        // Complete loan if fully paid
        if (loanDoc.balance === 0) {
            loanDoc.status = "completed";
        }

        const repaymentHistory = new loanRepayment({
             loanId : loanDoc._id,
             userId: req.userId,
             amount : repaymentAmount
        })

        return Promise.all([
            loanDoc.save(),
            repaymentHistory.save()
        ]);
    })
    .then(([updatedLoan, repaymentHistory]) => {
        res.status(200).json({
            meta:  {
                statusCode: 200,
                message: "Repayment was successfully processed"
            },

            data:{ 
                result:{
                    loanUpdate: updatedLoan,
                    repayment: repaymentHistory
                }
            }
        })
    })
    .catch(err => {
       next(err);
    })


}

exports.getRepaymentHistory = (req, res, next) => {
    const loanId = req.params.loanId;
    if(!loanId) {
        const error = new Error("Loan ID is required");
        error.statusCode = 400;
        throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(loanId)) {
        // loanId is not a valid MongoDB ObjectId
        const error = new Error("Invalid loan ID");
        error.statusCode = 400;
        throw error;
    }
    Loan.findById(loanId)
    .then(userLoan => {
        if(!userLoan){
            const error = new Error("Loan not found");
            error.statusCode = 404;
            throw error;
        }

        if(userLoan.userId.toString() !== req.userId.toString()){
            const error = new Error("Not authorized");
            error.statusCode = 403;
            throw error;
        }
        return loanRepayment.find({loanId: loanId}).sort({createdOn: -1})
        //return res.status(200).json({data: usersLoan})
    })
    .then(repaymentHistory => {
        if(repaymentHistory.length === 0) {
            return res.status(200).json({
                meta: {
                    statusCode: 200,
                    message: "No available repayment history"
                },
                data: {
                    result: []
                }
            })
        }

        const repaymentTransactionHistory = repaymentHistory.map(r => {
            return  {
                date: r.createdOn , 
                amount: r.amount/100, 
                repaymentId: r._id.toString()
            }
        })
        res.status(200).json({
            meta: {
                statusCode: 200,
                message: "Repayment history retrieved successfully"
            }, 
            data: {
                result: repaymentTransactionHistory
            }
        })
    })
    .catch(err => {
            next(err);
        }
    )
}