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
            name:{
                type: String,
                required: true
            },
            value: {
                type: String,
                required: false
            }
    },
    timeStamp: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("SessionJobs", sjobSchema);