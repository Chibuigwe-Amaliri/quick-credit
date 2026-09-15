exports.verifyExistingLoan = (existingLoan) => {
    if (existingLoan) {

        if (existingLoan.status === "pending") {
            const error = new Error(
                "Your loan application is pending. Please wait for approval before applying for another loan"
            );
            error.statusCode = 400;
            throw error;
        }

        if (existingLoan.status ==="approved" ) {
            const error = new Error(
                "You already have an outstanding loan, please repay to get another one"
            );
            error.statusCode = 400;
            throw error;
        }

    }

}