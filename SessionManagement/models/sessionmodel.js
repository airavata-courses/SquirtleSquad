const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;


const sessSchema = new mongoose.Schema({
    sessID: {
        type: ObjectId,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Session", sessSchema);
