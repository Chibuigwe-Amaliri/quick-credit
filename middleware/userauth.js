const jwt = require('jsonwebtoken');

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