const {usersAuthorization} = require('../middleware/userauth');

exports.getUserProfile = (req, res, next) => {

    const user = req.user;

    try {
        usersAuthorization(user);

         return res.status(200).json({
            meta: { 
                statusCode: 200,
                message: "succesfully approved auth token"
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
//     User.findById(userId).select('-password')
//     .then(userDoc => {

//         //req.user = userDoc;

//         usersAuthorization(userDoc)

//         return res.status(200).json({
//             meta: { 
//                 statusCode: 200,
//                 message: "succesfully approved auth token"
//             },

//             data: {
//                 result: {
//                     user: userDoc
//                 }
//             }
//         });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
}