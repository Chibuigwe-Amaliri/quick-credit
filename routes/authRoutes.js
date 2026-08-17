const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// POST /api/users/register
router.post('/api/v1/auth/register', authController.postRegister);

module.exports = router;