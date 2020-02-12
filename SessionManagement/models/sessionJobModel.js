const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const sjobSchema = new mongoose.Schema({
    sessID: {
        type: ObjectId,
        required: true
    },
    userID: {
        type: ObjectId,
        required: true
    },  
    action: {
        type: Object,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("SessionJobs", sjobSchema);