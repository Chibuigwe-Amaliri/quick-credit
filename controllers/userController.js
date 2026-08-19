const User = require('../models/user');

exports.getUserProfile = (req, res, next) => {
    const userId = req.userId;
    User.findById(userId).select('-password')
    .then(user => {
        if(!user) {
            return res.status(404).json({
                status: 404,
                error: 'User not found'
            });
        }

        if(user.status === 'unverified') {
            return res.status(404).json({
                status: 404,
                error: "Please check your email or write to admin to verify your account"
            });
        }
        return res.status(200).json({
            status: 200,
            data: user
        });
    })
    .catch(err => {
        next(err);
    });
}