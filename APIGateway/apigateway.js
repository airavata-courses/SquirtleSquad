const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const kafka = require('kafka-node');

const app = express();
const router = express.Router();

const topic = 'apigateway';
const Producer = kafka.Producer,
      Consumer = kafka.Consumer,
      client = new kafka.KafkaClient(),
      producer = new Producer(client),
      consumer = new Consumer(client,[{ topic: 'test'}],{autoCommit: true});

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



//BodyParser
app.use(express.urlencoded({extended: false}));

//Routes
//app.use('/dataRetrieval', require('./apis/dataRetieval'));
app.use('/sessionManagement', require('./apis/sessionManagement'));
//app.use('/ModelExecution', require('./apis/modelExec'));
//app.use('/Inference', require('.apis/inference'));




const PORT = process.env.PORT || 8082;

app.listen(PORT, console.log(`Server at port ${PORT}`));

