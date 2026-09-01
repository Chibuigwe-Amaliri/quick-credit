const {calculateInterestRate} = require('../middleware/util');
const Loan = require('../models/loan');

exports.postLoan = (req, res, next) => {
    //const unVerified = req.params.userId;
    const verifiedId = req.userId;

    if (!verifiedId) {
        const error = new Error(
            "You are not authorized to create this loan"
        );
        error.statusCode = 403;
        throw error;
    }

    Loan.findOne({
        userId: req.userId,
        status: { $in: ["pending", "approved"] },
        balance: {$gt: 0.}
    })
    .then(existingLoan => {

        if (existingLoan) {

             if (existingLoan.status === "pending") {
                const error = new Error(
                    "Your loan application is pending. Please wait for approval before applying for another loan"
                );
                error.statusCode = 400;
                throw error;
            }

            if (existingLoan.status ==="approved") {
                const error = new Error(
                    "You already have an outstanding loan, please repay to get another one"
                );
                error.statusCode = 400;
                throw error;
            }
          
        }
       
        const userId = req.userId;
        const loanAmount = req.body.loanAmount;
        const tenor = req.body.tenor;

        // Validate amount
        if (
            loanAmount === undefined ||
            loanAmount === null ||
            typeof loanAmount !== "number" ||
            !Number.isFinite(loanAmount) ||
            loanAmount <= 0
        ) {
            const error = new Error(
                "Loan amount must be a valid positive number"
            );
            error.statusCode = 400;
            throw error;
        }

        // Maximum 2 decimal places
        if (Math.round(loanAmount * 100) !== loanAmount * 100) {
            const error = new Error(
                "Loan amount cannot have more than 2 decimal places"
            );
            error.statusCode = 400;
            throw error;
        }

        // Validate tenor
        if (!Number.isInteger(tenor) || tenor < 1 || tenor > 12) {
            const error = new Error(
                "Tenor must be a whole number between 1 and 12 months"
            );
            error.statusCode = 400;
            throw error;
        }

        // Convert Naira → Kobo
        const loanAmountInKobo = Math.round(loanAmount * 100);

        // Calculate loan
        const interestRate = calculateInterestRate(tenor);

        const interest = Math.round(
            (loanAmountInKobo * interestRate) / 100
        );

        const totalAmount = loanAmountInKobo + interest;

        const paymentInstallment = Math.floor(
            totalAmount / tenor
        );

        const repay = 0;

        const balance = totalAmount;

        const status = "pending";

        // Create/save Loan here...
        const loan = new Loan({
            userId,
            loanAmountInKobo,
            tenor,
            interestRate,
            interest,
            totalAmount,
            paymentInstallment,
            repay,
            balance,
            status
        });

        return loan.save();
    })
    .then(userLoan => {
        return res.status(200).json({
            meta: {
                statusCode: 200,
                message: "Loan application was succesful"
            },
            data: {
                result:{loan: userLoan}
            }
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })


}