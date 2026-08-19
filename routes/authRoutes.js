const express = require('express');
const router = express.Router();
const { body} = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/authController');

// POST /api/users/register
router.post('/api/v1/auth/signup',
    [
        body('email')
        .trim()
        .isEmail()
        .custom((value, {req}) => {
            return User.findOne({email: value})
            .then(UserDoc => {
                if(UserDoc) {
                    return Promise.reject('Email already exist.');
                }
            })
        })
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),

        body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 6 characters long.'),

        body('firstName')
        .trim()
        .notEmpty()
        .isLength({min: 5})
        .withMessage('First name is required.'),

        body('lastName')
        .trim()
        .notEmpty()
        .isLength({min: 5})
        .withMessage('Last name is required.'),

        body('address')
        .trim()
        .notEmpty()
        .isLength({min: 5})
        .withMessage('Address is required.')
    ], 
    authController.postSignUp
);

// POST /api/users/register
router.post('/api/v1/auth/signin', 
    [
        body('email')
        .notEmpty()
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email.'),

        body('password')
        .trim()
        .isLength({min: 5})
        .withMessage('password must not be less than 5 characters')
    ],
    authController.postSignIn);

module.exports = router;