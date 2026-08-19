const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/userauth');
const userController = require('../controllers/userController');
 
// POST /api/users/register
router.get('/api/v1/users/profile', authMiddleware.authenticateUser, userController.getUserProfile);

module.exports = router;