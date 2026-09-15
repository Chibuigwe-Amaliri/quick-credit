exports.validateRepaymentAmount = (balance, installment, paymentInstallment) => {
    
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
        const repayment = Math.round(installment * 100);
       
        if(repayment > balance) {
            const error = new Error("Repayment amount cannot be greater than the outstanding balance");
            error.statusCode = 400;
            throw error;
        }

        if(repayment < paymentInstallment && paymentInstallment <= balance){
        const error = new Error("payment must be equall to installment or more");
        error.statusCode = 400;
        throw error;
        }
        
        if(paymentInstallment > repayment && balance <  paymentInstallment && repayment !== balance){
        const error = new Error("Complete the amount and continue");
        error.statusCode = 400;
        throw error;
        }
    
    return repayment
}
