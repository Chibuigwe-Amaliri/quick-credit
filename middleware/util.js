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

