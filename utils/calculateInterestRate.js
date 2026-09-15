exports.calculateInterestRate = (tenor) => {
  
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