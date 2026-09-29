const Loan = require('../models/loan');
const {verifyInputValidation, verifyMongoId, validateTenor} = require('../utils/verifyLoanInputvalidation');
const {calculateInterestRate} = require('../utils/calculateInterestRate');
const { verifyExistingLoan } = require('../utils/verifyExistingLoan');
const { businessLogic } = require('../utils/repaymentBusinessLogic');

exports.postLoan = async(req, res, next) => {
    const verifiedId = req.userId;

    try {

        if (!verifiedId) {
            const error = new Error(
                "You are not authorized to create this loan"
            );
            error.statusCode = 403;
            throw error;
        }
            
        const existingLoan = await Loan.findOne({
            userId: req.userId,
            isActive: true
        });

        verifyExistingLoan(existingLoan);
        
        const userId = verifiedId;

        const appliedLoan = req.body.loanAmount;

        const tenor = req.body.tenor;

        // validate inputs & calculate interestrate
        const loanAmount = verifyInputValidation(appliedLoan);

        const calculatedTenor = validateTenor(tenor);

        const calculatedInterestRate = calculateInterestRate(calculatedTenor);

        // Create/save Loan here...
        const loan = businessLogic(loanAmount, calculatedInterestRate, calculatedTenor, userId, Loan)

        const userLoan = await loan.save();

        return res.status(201).json({
            meta: {
                statusCode: 201,
                message: "Loan application was successful"
            },
            data: {
                result:{
                    loanId: userLoan._id,
                    userId: userLoan.userId,
                    loanAmount: userLoan.appliedAmount / 100,
                    tenor: userLoan.loanDuration,
                    interestRate: userLoan.interestRate,
                    interest: userLoan.interest / 100,
                    totalAmount: userLoan.totalAmount / 100,
                    paymentInstallment: userLoan.paymentInstallment / 100,
                    repayment: userLoan.repayment / 100,
                    balance: userLoan.balance / 100,
                    status: userLoan.status,
                }
            }
        })
    } catch(err) {
        next(err);
    }

}

    exports.getAllUsersLoan = async(req, res, next) => {
        const verifiedId = req.userId;
    
        try {
            // Verify the loanId is a valid MongoDB ObjectId
            verifyMongoId(verifiedId);
            const userLoan = await Loan.find({userId: verifiedId});
            if (!userLoan || userLoan.length === 0) {
                const error = new Error("Loan not found");
                error.statusCode = 404;
                throw error;
            }

            const loanData = userLoan.map(loan => ({
                loanId: loan._id,
                userId: loan.userId,
                loanAmount: loan.appliedAmount / 100,
                tenor: loan.loanDuration,
                interestRate: loan.interestRate,
                interest: loan.interest / 100,
                totalAmount: loan.totalAmount / 100,
                paymentInstallment: loan.paymentInstallment / 100,
                repayment: loan.repayment / 100,
                balance: loan.balance / 100,
                status: loan.status,
            }));
          
            return res.status(200).json({
                meta: {
                    statusCode: 200,
                    message: "Loan found successfully"
                },
                data: {
                    result: loanData
                }
            });
        } catch (err) {
            next(err);
        }
    }