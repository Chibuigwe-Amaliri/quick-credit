const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middleware/userauth');
const repaymentController = require('../controllers/repaymentController');
const loanController = require('../controllers/loanController'); 
const {idempotencyMiddleware} = require('../middleware/idempotency');

// POST /api/users/loan
router.post('/api/v1/loan', authenticateUser, idempotencyMiddleware, loanController.postLoan);

// POST /api/users/repayment
router.patch('/api/v1/loan/:loanId/repayment', authenticateUser,idempotencyMiddleware, repaymentController.postLoanRepayment);

router.get('/api/v1/loan/:loanId/payment-history', authenticateUser, repaymentController.getRepaymentHistory);


module.exports = router;

