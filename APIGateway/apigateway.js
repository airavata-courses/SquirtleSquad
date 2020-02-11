const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const kafka = require('kafka-node');

const app = express();
const router = express.Router();

const topic = 'apigateway';
const client = new kafka.client('localhost:9092');
const producer = new kafka.HighLevelProducer(client);
const consumer = new kafka.HighLevelConsumer(client, {topics:topic});

producer.on('ready', function(){
    //Create a message
    var msg = "Hi! This is APIgateway";
    var payLoad = [{
        topic: topic,
        message: msg,
    }];  
    producer.send(payLoad, function(err, res){
        if(err){
            console.log(err);
        } else {
            console.log("Sent payload to kafka"+" "+msg);
        }
    });
});

producer.on('error', function(err){
    console.log(err);
});

consumer.on()

//BodyParser
app.use(express.urlencoded({extended: false}));

//Routes
app.use('/dataRetrieval', require('./apis/dataRetrieval'));
app.use('/sessionManagement', require('./apis/sessionManagement'));
app.use('/ModelExecution', require('./apis/modelExec'));
app.use('/Inference', require('.apis/inference'));




const PORT = process.env.PORT || 8082;

app.listen(PORT, console.log(`Server at port ${PORT}`));

module.exports = router;
