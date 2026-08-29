const User = require('../models/user');
const Loan = require('../models/loan')
const mongoose = require('mongoose');

exports.verifyUserHandler = async(req, res, next) => {

const usersId = req.params.userId;

    try {

          if (!mongoose.Types.ObjectId.isValid(usersId)) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findById(usersId);
        if(!user){
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        if(user.status === "verified") {
            const error = new Error("User has already been verified");
            error.statusCode = 400;
            throw error;
        }
        user.status = 'verified';

        const updatedUser = await user.save();
    
        return res.status(200).json({
            meta: {
                statusCode: 200,
                message: "user has been successfully verified"
            },
            data: {
                result:{
                    firstName: updatedUser.firstName,
                    email: updatedUser.email,
                    status: updatedUser.status
                }
            }
        });
    }catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    }
 
}

exports.getAllLoans = async (req, res, next) => {

    try {
        const retrievedLoan = await 
        Loan.find()
        .populate(
            'userId',
            'firstName email address'
        );

        if(retrievedLoan.length <= 0 ) {
            const error = new Error("No loan was found");
            error.statusCode = 404;
            throw error;
        }
        const loanData = retrievedLoan.map(loan => { 
            return {
                UserId: loan.userId._id,
                FirstName: loan.userId.firstName,
                Email: loan.userId.email,
                LoanId: loan._id,
                Status: loan.status,
                TotalAmount: loan.totalAmount/100,
                Tenor: loan.tenor,
                Installment: loan.installment,
                AmountRepaid: loan.repay/100,
                Balance: loan.balance
            }
        });

        return res.status(200).json({
            meta: {
                statusCode: 200,
                message: "Loan documents was successfully retrieved"
            },
            data : {
                result: loanData
            }
        })
    }catch(err) {
        next(err);
    }
        
}
