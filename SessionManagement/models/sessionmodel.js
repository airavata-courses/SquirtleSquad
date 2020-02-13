const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;


const sessSchema = new mongoose.Schema({
    userID: {
        type: ObjectId,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Session", sessSchema);
