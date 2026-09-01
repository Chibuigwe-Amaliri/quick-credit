const express = require('express');
const router = express.Router();
const userauth = require('../middleware/userauth');
const userController = require('../controllers/userController');
 
// POST /api/users/register
router.get('/api/v1/users/profile', userauth.authenticateUser, userauth.loadUser, userController.getUserProfile);

module.exports = router;


