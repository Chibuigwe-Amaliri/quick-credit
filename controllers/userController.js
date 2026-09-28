const {usersAuthorization} = require('../middleware/userauth');

exports.getUserProfile = (req, res, next) => {

    const user = req.user;

    try {
        usersAuthorization(user);

         return res.status(200).json({
            meta: { 
                statusCode: 200,
                message: "Authentication successful"
            },

            data: {
                result: {
                    user: user
                }
            }
        });
    }catch(err){
        next(err)
    }
}

exports.logoutUser = (req, res, next) => {
    const user = req.user;
    try {
        usersAuthorization(user);
        return res.status(200).json({
            meta: {
                statusCode: 200,
                message: "User logged out successfully"
            }
        });
    } catch (err) {
        next(err);
    }
}