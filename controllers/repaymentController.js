const Loan = require('../models/loan');
const loanRepayment = require('../models/repayment');
const Idempotency = require('../models/idempotency');
const mongoose = require('mongoose');
const { verifyMongoId } = require('../utils/verifyLoanInputvalidation');

const {validateRepaymentAmount} = require('../utils/validateRepaymentAmount');


exports.postLoanRepayment = async(req, res, next) => {
    const userId = req.userId;
    const repayment = req.body.loanRepayment;
    const loanId = req.params.loanId;
    const idempotencyKey = req.get("Idempotency-key");

try {
    // Mongobe transaction to ensure atomicity of the repayment 
    const response = await mongoose.connection.transaction(async(session) => {
        const loanDoc = await Loan
        .findOne({userId: userId, _id:loanId, balance: { $gt: 0 }, status: 'approved'})
        .session(session)
        

        if (!loanDoc) {
            const error = new Error(
                "You do not have an outstanding loan to repay"
            );
            error.statusCode = 404;
            throw error;
        };
    
        const repaymentAmount = validateRepaymentAmount(loanDoc.balance, repayment, loanDoc.paymentInstallment);

        loanDoc.repayment += repaymentAmount;
        loanDoc.balance -= repaymentAmount;

        // Complete loan if fully paid
        if (loanDoc.balance === 0) {
            loanDoc.status = "completed";
            loanDoc.isActive = false;
        }

        const repaymentHistory = new loanRepayment({
                loanId : loanDoc._id,
                userId: userId,
                amount : repaymentAmount,
                recordedBy: userId,
        })

        const updatedLoan = await loanDoc.save({session});
        const savedRepayment = await repaymentHistory.save({session});
        
        const response = {
            meta:  {
                statusCode: 200,
                message: "Repayment was successfully processed"
            },
            data:{ 
                result:{
                    loanUpdate: {
                        id:updatedLoan._id, 
                        status: updatedLoan.status, 
                        balance: updatedLoan.balance/100,
                    },
                    repayment: {
                        id: savedRepayment._id,
                        amount: savedRepayment.amount/100,
                        recordedBy: savedRepayment.recordedBy,
                        createdOn: savedRepayment.createdOn
                    }
                }
            }
        }
        // create idempotency
        await Idempotency.create(
           [{
                key: idempotencyKey,
                userId: userId,
                status: "completed",
                response: response
            }],
            { session }
        );

        return response;
    })

    return res.status(200).json(response);

    }catch(err) {
       if (err.code === 11000 && err.keyPattern?.key) {
            const existingRequest = await Idempotency.findOne({
                key: idempotencyKey,
                userId: userId
            });

            if (existingRequest) {
                return res
                    .status(existingRequest.response.meta.statusCode)
                    .json(existingRequest.response);
            }
        }
        next(err)
    }
}

exports.getRepaymentHistory = (req, res, next) => {
    const id = req.params.loanId;
    if(!id) {
        const error = new Error("Loan ID is required");
        error.statusCode = 400;
        throw error;
    }
    const loanId = verifyMongoId(id);

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
        .populate('recordedBy', 'firstName lastName email');
       
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
                repaymentId: r._id.toString(),
                recordedBy: r.recordedBy.firstName + " " + r.recordedBy.lastName
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