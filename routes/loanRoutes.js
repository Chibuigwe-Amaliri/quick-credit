const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middleware/userauth');
const repaymentController = require('../controllers/repaymentController');
const loanController = require('../controllers/loanController'); 
// POST /api/users/loan
router.post('/api/v1/loan', authenticateUser, loanController.postLoan);

// POST /api/users/repayment
router.patch('/api/v1/loan/repayment', authenticateUser, repaymentController.postLoanRepayment);

router.get('/api/v1/loan/:loanId/repayment', authenticateUser, repaymentController.getRepaymentHistory);


module.exports = router;

