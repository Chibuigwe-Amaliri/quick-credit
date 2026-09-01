const jwt = require('jsonwebtoken');
const User = require('../models/user');



exports.authenticateUser = (req, res, next) => {

    const authHeader = req.get('Authorization');

    if(!authHeader) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    if(!authHeader.startsWith('Bearer ')) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token =authHeader.split(' ')[1];

    // check if toke is available
    if(!token) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    }
    catch(err) {
        err.statusCode = 401;
        throw err;
    }

  req.userId = decodedToken.userId;

  next();

}

exports.loadUser =  (req, res, next) => {

   const userId = req.userId;

     User.findById(userId).select('-password')
     .then(user => {
         if(!user) {
             const error = new Error(
                "User is not found"
            );
             error.statusCode = 403;

             throw error;
         }
        req.user = user;

        next();
     })
     .catch(err => {
        next(err);
     })
    
}

exports.usersAuthorization = (user) => {

    if(!user) {
        const error = new Error("User is not found");
        error.statusCode = 403;
        throw error;
    }
    
    if(user.status === 'unverified') {
            const error = new Error('Please very your account and continue.');
            error.statusCode = 401;
            throw error;
    }


}

exports.adminAuthorization = (req, res, next) => {
    const user = req.user;
    
    if(user.status === 'unverified') {
            const error = new Error('Please very your account and continue.');
            error.statusCode = 401;
            throw error;
    }

    if(user.isAdmin !== true) {
        const error = new Error("You are not authorized to view this page");
        error.statusCode = 403;
        throw error;
    }
    
    next();
}
