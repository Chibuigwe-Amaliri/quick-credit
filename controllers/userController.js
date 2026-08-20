const User = require('../models/user');

exports.getUserProfile = (req, res, next) => {
    const userId = req.userId;
    User.findById(userId).select('-password')
    .then(user => {
        if(!user) {
            const error = new Error('This user cannot be found.');
            error.statusCode = 401;
            throw error;
        }

        if(user.status === 'unverified') {
            const error = new Error('Please very your account and continue.');
            error.statusCode = 401;
            throw error;
        }

        return res.status(200).json({
            meta: { 
                status: 200,
                message: "succesfully approved auth token"
            },

            data: {
                result: {
                    user: user
                }
            }
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}