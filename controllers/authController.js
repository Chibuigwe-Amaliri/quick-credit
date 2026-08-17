    const User = require('../models/user');
    const bcrypt = require('bcryptjs');
    
    exports.postRegister = (req, res, next) => { 
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const address = req.body.address;


        User.findOne({email: email})
        .then(existingUser => {
            if(existingUser){
               const error =  new Error('user already existing please login');
                error.httpStatus = 409;
                throw error;
            }

            return bcrypt.hash(password, 12)
        })
        .then(hashedPassword => {
                 // if user does not exist
            const newUser = new User({
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: hashedPassword,
                address: address
            })

            return newUser.save();
        })
        .then(user => {
            res.status(201)
            .json({ 
                message: 'User registered successfully' ,
                user: user._id
            });
        })
        .catch(err => {
            if (!err.httpStatus) {
                err.httpStatus = 500;
            }

            next(err);
        })
    }