const mongoose = require('mongoose');
exports.verifyInputValidation = (loanAmount) => {
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

    return loanAmount
}


exports.validateTenor = (tenor) => {
       // Validate tenor
    if (!Number.isInteger(tenor) || tenor < 1 || tenor > 12) {
        const error = new Error(
            "Tenor must be a whole number between 1 and 12 months"
        );
        error.statusCode = 409;
        throw error;
    }

    return tenor;
}

exports.verifyMongoId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("The provided ID is invalid.");
        error.statusCode = 400;
        throw error;
    }

    return id;
}