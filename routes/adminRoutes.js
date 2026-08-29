const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/userauth');
const adminController = require('../controllers/adminController');


router.patch(
    '/api/v1/admin/:userId/verify', 
    authMiddleware.authenticateUser, 
    authMiddleware.loadUser, 
    authMiddleware.adminAuthorization, 
    adminController.verifyUserHandler
)

router.get(
    '/api/v1/admin/loans', 
    authMiddleware.authenticateUser, 
    authMiddleware.loadUser, 
    authMiddleware.adminAuthorization, 
    adminController.getAllLoans
)

module.exports = router;