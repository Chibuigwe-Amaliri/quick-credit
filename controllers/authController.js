    const User = require('../models/user');
    const bcrypt = require('bcryptjs');
    const { validationResult } = require('express-validator');
    const jwt = require('jsonwebtoken');

    exports.postSignUp = (req, res, next) => { 
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const address = req.body.address;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(404).json({
                status:404,
                error: errors.array()[0].msg
            });
        }

        User.findOne({email: email})
        .then(existingUser => {

            if(existingUser){
              return res.status(404)
                .json({ 
                    status: 404,
                    error: 'User already exists'
                });
            }

            return bcrypt.hash(password, 12)
        })
        .then(hashedPassword => {
                 // if user does not exist
                if(!hashedPassword){
                    return;
                }
            const newUser = new User({
                email,
                firstName,
                lastName,
                password: hashedPassword,
                address
            });

            return newUser.save();
        })
        .then(user => {
            if (!user) {
                return;
            }
            res.status(200)
            .json({ 
                status: 200 ,
                data: user._id
            });
        })
        .catch(err => {
            if (!err.httpStatus) {
                err.httpStatus = 500;
            }
            next(err);
        })
    }


    exports.postSignIn = (req, res, next) => { 
      const email = req.body.email;
      const password = req.body.password;
      let loadUser;
      const error = validationResult(req);

      if(!error.isEmpty()) {
        return res.status(422).json({
            message:'Validation failed',
            errors: error.array()
        });
      }
    
      User.findOne({email: email})
      .then(userDoc => {
        // confirm if user exist
        loadUser = userDoc;

        if(!userDoc) {
            return res.status(404).json({
                status: 404, 
                error: "User does not exist"
            });
        }

        // check if password match
        return bcrypt.compare(password, userDoc.password);
      })
      .then(isEqual => {
        // confirm if the password is equall
        if(!isEqual) {
            return res.status(404).json({
                status:404,
                error: "Password does not match..."
            })
        }
        
        // create a token
        const token = jwt.sign({
            email: loadUser.email,
            userId : loadUser._id.toString()
            }, 
            process.env.JWT_SECRET_KEY,
            {expiresIn: '1h'}
        )

        return res.status(200).json({
            status: 200,
            token: token, 
            userId: loadUser._id.toString()
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatus = 500;
        next(err)
      })
    }