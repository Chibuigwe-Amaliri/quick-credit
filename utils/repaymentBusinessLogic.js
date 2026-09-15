exports.businessLogic = (loanAmount, calculatedInterestRate, calculatedTenor,userId, Loan) => {
  // prepare database input variables
        // Convert Naira → Kobo
        const appliedAmount = Math.round(loanAmount * 100);

        // Calculate loan
        const loanDuration = calculatedTenor;

        const interestRate = calculatedInterestRate;

        const interest = Math.round(
            (appliedAmount * interestRate) / 100
        );

        const totalAmount = appliedAmount + interest;

        const paymentInstallment = Math.floor(
            totalAmount / loanDuration
        );

        const repayment = 0;

        const balance = totalAmount;

        const status = "pending";

          const loan = new Loan({
            userId,
            appliedAmount,
            loanDuration,
            interestRate,
            interest,
            totalAmount,
            paymentInstallment,
            repayment,
            balance,
            status,
            isActive:true
        });

        return loan;
}