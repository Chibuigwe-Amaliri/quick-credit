exports.calculateInterestRate = (tenor) => {
    if (tenor < 1 || tenor > 12) {
        const error = new Error(
            "Tenor must be between 1 and 12 months"
        );
        error.statusCode = 400;
        throw error;
    }

    if (tenor <= 3) {
        return 3;
    }

    if (tenor <= 6) {
        return 6;
    }

    if (tenor <= 9) {
        return 10;
    }

    return 12;
};

exports.validateRepayamount = (loanDoc, installment) => {
    
        if (
            typeof installment !== "number" ||
            !Number.isFinite(installment) ||
            installment <= 0
        ) {
            const error = new Error(
                "Repayment amount must be a valid positive number"
            );
            error.statusCode = 400;
            throw error;
        };

       if (Math.round(installment * 100) !== installment * 100) {
            const error = new Error(
                "Repayment amount cannot have more than 2 decimal places"
            );
            error.statusCode = 400;
            throw error;
        };

        //const balance = loanDoc.balance;
        const repaymentAmount = Math.round(installment * 100);

        if(repaymentAmount > loanDoc.balance) {
            const error = new Error("Repayment amount cannot be greater than the outstanding balance");
            error.statusCode = 400;
            throw error;
        }
    
    return repaymentAmount;
}

exports.veryfiMongoId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("The provided ID is invalid.");
        error.statusCode = 400;
        throw error;
    }

    return id;
}