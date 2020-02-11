const express = require('express');
//const expressLayouts = require('express-ejs-layouts');
//const mongoose = require('mongoose');
const kafka = require('kafka-node');

const app = express();
const router = express.Router();
const topic = 'apigateway';
const client = new kafka.KafkaClient();
const Producer = kafka.HighLevelProducer;
const producer = new Producer(client);

Consumer = kafka.Consumer,
consumer = new Consumer(client,[{ topic: 'sessionManagement'}],{autoCommit: true});

producer.on('ready', function(){
    //Create a message
    var msg = "Hi! This is APIgateway";
    var payLoad = [{
        topic: topic,
        message: msg,
    }];  
});

producer.on('error', function(err){
    console.log(err);
});
/*
consumer.on('message', function (message){
    var msg = message.value;
    console.log(msg);
});

consumer.on('error', function(err){
    console.log(err)
});

process.on('SIGINT', function() {
    consumer.close(true, function() {
      process.exit();
    });
  });
*/
//BodyParser
app.use(express.urlencoded({extended: false}));

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server at port ${PORT}`));

