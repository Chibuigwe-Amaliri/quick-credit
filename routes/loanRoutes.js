const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middleware/userauth');
const repaymentController = require('../controllers/repaymentController');
const loanController = require('../controllers/loanController'); 
const {idempotencyMiddleware} = require('../middleware/idempotency');

// POST /api/users/loan-application
router.post('/api/v1/loan/', authenticateUser, idempotencyMiddleware, loanController.postLoan);

// GET /api/users-current-loan
router.get('/api/v1/loan/get-all', authenticateUser, loanController.getAllUsersLoan);

// POST /api/users/repayment
router.patch('/api/v1/loan/:loanId/repayment', authenticateUser,idempotencyMiddleware, repaymentController.postLoanRepayment);

// get repayment history for a specific loan
router.get('/api/v1/loan/:loanId/payment-history', authenticateUser, repaymentController.getRepaymentHistory);


module.exports = router;

