const Idempotency = require("../models/idempotency");

exports.idempotencyMiddleware = async(req, res, next) => {

    const userId = req.userId

    const idempotencyKey = req.headers['idempotency-key'];

    try{

    // check for the idempotency key
        if(!idempotencyKey){
            const error = new Error(
                "Idempotency-Key header is required"
            );
            error.statusCode = 400;
            throw error;
        }
    
        // check if the request has already been made
        const existingRequest = await Idempotency.findOne({
            key: idempotencyKey,
            userId: userId
        });
    
        if(existingRequest && existingRequest.status === "completed") {
            return res.status(
                existingRequest.response.meta.statusCode
            ).json(
                existingRequest.response
            )
        }

        next();

    }catch(err){
        next(err)
    }
      
};
