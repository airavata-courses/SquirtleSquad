const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Session = require('./models/sessionmodel');
const kafka = require('kafka-node');
const sess = express();
sess.use(bodyParser.json());

//DB config
const db = require('../config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('Session MongoDB Connected...'))
    .catch(err => console.log(err));

//Kafka pipelines
Producer = kafka.Producer;
Consumer = kafka.Consumer;
client = new kafka.KafkaClient();
producer = new Producer(client);
consumerApiGate = new Consumer(client,[{ topic: 'apigateway'}],{autoCommit: true});
consumerDataRet = new Consumer(client,[{ topic: 'dataretrieval'}],{autoCommit: true});
consumerModExec = new Consumer(client,[{ topic: 'postanalysis'}],{autoCommit: true});

consumerApiGate.on('message', function (message) {
  console.log(message);
  const sess = new Session(JSON.parse(message.value));
  sess.save(function (err, data) {
    if (err){
      return console.error(err);
    } 
    console.log("Saved Data: ",data);
  });
});

consumerDataRet.on('message', function (message) {
  console.log(message);
  const sess = new Session(JSON.parse(message.value));
  sess.save(function (err, data) {
    if (err){
      return console.error(err);
    } 
    console.log("Saved Data: ",data);
  });
});

consumerModExec.on('message', function (message) {
  console.log(message);
  const sess = new Session(JSON.parse(message.value));
  sess.save(function (err, data) {
    if (err){
      return console.error(err);
    } 
    console.log("Saved Data: ",data);
  });
});

consumerApiGate.on('error', function(err) {
  console.log('error', err);
});

consumerDataRet.on('error', function(err) {
  console.log('error', err);
});

consumerModExec.on('error', function(err) {
  console.log('error', err);
});

const PORT = 8082;
sess.listen(PORT, console.log(`Server at port ${PORT}`));