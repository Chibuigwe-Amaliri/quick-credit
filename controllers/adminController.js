const User = require('../models/user');
const Loan = require('../models/loan');
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
                userId: loan.userId._id,
                firstName: loan.userId.firstName,
                email: loan.userId.email,
                loanId: loan._id,
                status: loan.status,
                totalAmount: loan.totalAmount/100,
                tenor: loan.tenor,
                installment: loan.installment,
                repay: loan.repay/100,
                balance: loan.balance
            }
        });

        return res.status(200).json({
            meta: {
                statusCode: 200,
                message: "Loan documents were successfully retrieved"
            },
            data : {
                result: loanData
            }
        })
    }catch(err) {
        next(err);
    }
        
}

exports.getSingleLoan = async(req, res, next) => {
    // admin is already authenticated and authorized at this point
    // get the loanId
    const loanId = req.params.loanId;

    try {

        if (!mongoose.Types.ObjectId.isValid(loanId)) {
            const error = new Error("Invalid loan ID");
            error.statusCode = 400;
            throw error;
        }

        const singleLoan = await Loan.findById(loanId)
        .populate('userId', 'firstName email status');

        if(!singleLoan) {
            const error = new Error("Loan not found");
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            meta:{
                statusCode:200,
                message: "Loan was successfully retrieved."
            },
            data : {
                result: {
                    loanId: singleLoan._id,
                    firstName: singleLoan.userId.firstName,
                    email: singleLoan.userId.email,
                    userStatus: singleLoan.userId.status,
                    loanStatus: singleLoan.status,
                    totalAmount: singleLoan.totalAmount/100,
                    balance: singleLoan.balance/100,
                    repay: singleLoan.repay/100
                }
            }
        })
    } catch(err) {
        next(err);
    }
}

exports.updateLoanStatus =async(req, res, next) => {
    const loanId = req.params.loanId;
    const status = req.body.status;

    try {
        if (!mongoose.Types.ObjectId.isValid(loanId)) {
            const error = new Error("Invalid loan ID");
            error.statusCode = 400;
            throw error;
        }

        if (status !== "approved" && status !== "rejected") {
            const error = new Error("You can only approve or reject a loan.");
            error.statusCode = 400;
            throw error;
        } 

        const singleLoan = await Loan.findById(loanId);

        if (!singleLoan) {
            const error = new Error("Loan not found");
            error.statusCode = 404;
            throw error;
        }
        
        if(singleLoan.status === "pending" ){

            singleLoan.status = statusValue;

        } else{
            const error = new Error("Loan status can only be changed when the loan is pending.");
            error.statusCode = 409;
            throw error;
        }

        const savedStatus = await singleLoan.save();

        return res.status(200).json({
            meta: {
                statusCode: 200,
                message: "Loan status was successfully updated."
            },
            data:{
                result: {
                    status: savedStatus.status,
                    loanId: savedStatus._id
                }
            }
        })

    }catch(err) {
        next(err);
    }
}

