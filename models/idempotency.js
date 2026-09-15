const mongoose = require("mongoose");

const idempotencySchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            trim: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["processing", "completed", "failed"],
            required: true
        },

        response: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// A user cannot reuse the same idempotency key
idempotencySchema.index(
    { userId: 1, key: 1 },
    { unique: true }
);

module.exports = mongoose.model("Idempotency", idempotencySchema);