const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmailVerification } = require('../service/emailService');

exports.postSignUp = (req, res, next) => { 

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const address = req.body.address;

    const verificationToken =
    crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 60 * 60 * 1000
    
    User.findOne({email: email})
    .then(existingUser => {

        if(existingUser){
            const error = new Error('This email belongs to an existing user.');
            error.statusCode = 401;
            throw error;
        }

        return bcrypt.hash(password, 12)
    })
    .then(hashedPassword => {
        if(!hashedPassword){
            const error = new Error('Validation failed.');
            error.statusCode = 404;
            throw error;
        }
        const newUser = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            address,
            verificationToken,
            verificationTokenExpires
        });

        return newUser.save();
    })
    .then(async user => {
        if (!user) {
            const error = new Error('Invalid user.');
            error.statusCode = 401;
            throw error; 
        }
        await sendEmailVerification(
            user.email, 
            user.firstName,
            user.verificationToken,
            user.verificationTokenExpires
        );

        return res.status(200)
        .json({ 
            meta: {
                statusCode: 200,
                message: "successfully registered"
            },
            data: {
                result:{
                    userId: user._id.toString(),
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                }
            }
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    })
}


exports.postSignIn = (req, res, next) => { 
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        console.log(error.data[0].msg)
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    let loadUser;

    User.findOne({email: email})
    .then(userDoc => {

    if(!userDoc) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }
    // confirm if user exist
    loadUser = userDoc;

    // check if password match
    return bcrypt.compare(password, userDoc.password);
    })
    .then(isEqual => {
    // confirm if the password is equall
    if(!isEqual) {
        const error = new Error('Password does not match.');
        error.statusCode = 401;
        throw error;
    }
    
    // create a token
    const token = jwt.sign({
        email: loadUser.email,
        userId : loadUser._id.toString()
        }, 
        process.env.JWT_SECRET_KEY,
        {expiresIn: '24h'}
    )

    return res.status(200).json({
        meta: { 
            statusCode: 200,
            message: " token was successfully generated"
        },
        data: {
            result: {
                token: token, 
                userId: loadUser._id.toString()
            }
        }
    });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
      next(err);
    })
}

exports.getVerifyEmail = async(req, res, next) => {
    const token = req.query.token;

    try {

        const user = await User.findOne({verificationToken: token, verificationTokenExpires: {$gt: Date.now()}})
    
        if (!user) {
            const error = new Error('Invalid or expired verification token');
            error.statusCode = 401;
            throw error;
        }
    
        user.status = "verified";
        user.verificationToken = null;
        user.verificationTokenExpires = null;
        await user.save();
        res.status(200).json({
            meta: {
                statusCode: 200,
                message: "Successfully verified, you can now login"
            },
            data: {
                result:{}
            }
        })
    }catch(err) {
        next(err)
    }

}