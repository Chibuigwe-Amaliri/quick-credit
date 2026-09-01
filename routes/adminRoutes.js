const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/userauth');
const adminController = require('../controllers/adminController');

// Verify user
router.patch(
    '/api/v1/admin/:userId/verify', 
    authMiddleware.authenticateUser, 
    authMiddleware.loadUser, 
    authMiddleware.adminAuthorization, 
    adminController.verifyUserHandler
)

// view all loans
router.get(
    '/api/v1/admin/loans', 
    authMiddleware.authenticateUser, 
    authMiddleware.loadUser, 
    authMiddleware.adminAuthorization, 
    adminController.getAllLoans
)

// view a single loan
router.get(
    '/api/v1/admin/:loanId/loan', 
    authMiddleware.authenticateUser, 
    authMiddleware.loadUser, 
    authMiddleware.adminAuthorization, 
    adminController.getSingleLoan
)

//admin can update the loan status
router.patch(
    '/api/v1/admin/:loanId/status', 
    authMiddleware.authenticateUser, 
    authMiddleware.loadUser, 
    authMiddleware.adminAuthorization, 
    adminController.updateLoanStatus
)

// admin can post repayment
router.patch(
    '/api/v1/admin/:loanId/postrepayment', 
    authMiddleware.authenticateUser, 
    authMiddleware.loadUser, 
    authMiddleware.adminAuthorization, 
    adminController.postRepayment
)

// admin can post repayment
router.get(
    '/api/v1/admin/repaid/loans', 
    authMiddleware.authenticateUser, 
    authMiddleware.loadUser, 
    authMiddleware.adminAuthorization, 
    adminController.repaidLoans
)

// admin can post repayment
router.get(
    '/api/v1/admin/:loanId/postrepayment', 
    authMiddleware.authenticateUser, 
    authMiddleware.loadUser, 
    authMiddleware.adminAuthorization, 
    adminController.notFullyRepaidLoans
)

module.exports = router;