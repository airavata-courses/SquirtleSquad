const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const kafka = require('kafka-node');

const app = express();
const router = express.Router();
const topic = 'apigateway';
<<<<<<< HEAD
const Producer = kafka.Producer,
      Consumer = kafka.Consumer,
      client = new kafka.KafkaClient(),
      producer = new Producer(client),
      consumer = new Consumer(client,[{ topic: 'test'}],{autoCommit: true});
=======
const client = new kafka.KafkaClient();
const Producer = kafka.HighLevelProducer;
//const Consumer = kafka.Consumer;
const producer = new Producer(client);
//let consumer = new Consumer(client, topic);

Consumer = kafka.Consumer,
//client = new kafka.KafkaClient(),
//producer = new Producer(client),
consumer = new Consumer(client,[{ topic: topic}],{autoCommit: true});
>>>>>>> 860b936fb2fbb45cf1c574b4eeb6a4af9d7407cc

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
});bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic test_result

consumer.on('message', function (message){
    var msg = message.value;
    console.log(msg);
});

<<<<<<< HEAD

=======
consumer.on('error', function(err){
    console.log(err)
});

process.on('SIGINT', function() {
    consumer.close(true, function() {
      process.exit();
    });
  });
>>>>>>> 860b936fb2fbb45cf1c574b4eeb6a4af9d7407cc

//BodyParser
app.use(express.urlencoded({extended: false}));

//Routes
<<<<<<< HEAD
//app.use('/dataRetrieval', require('./apis/dataRetieval'));
app.use('/sessionManagement', require('./apis/sessionManagement'));
=======
//app.use('/dataRetrieval', require('./apis/dataRetrieval'));
//app.use('/sessionManagement', require('./apis/sessionManagement'));
>>>>>>> 860b936fb2fbb45cf1c574b4eeb6a4af9d7407cc
//app.use('/ModelExecution', require('./apis/modelExec'));
//app.use('/Inference', require('.apis/inference'));




const PORT = process.env.PORT || 8082;

app.listen(PORT, console.log(`Server at port ${PORT}`));

