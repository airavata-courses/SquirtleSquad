const express = require('express');
const sess = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Session = require('./models/sessionmodel');

sess.use(bodyParser.json());

//DB config
const db = require('../config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('Session MongoDB Connected...'))
    .catch(err => console.log(err));

const kafka = require('kafka-node'),
    Producer = kafka.Producer,
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(),
    producer = new Producer(client),
    consumer = new Consumer(client,[{ topic: 'addAction'}],{autoCommit: true});



    consumer.on('message', function (message) {
      console.log(message);
      let sess = new Session(JSON.parse(message.value));
      sess.save(function (err, data) {
        if (err) return console.error(err);
        console.log("Saved Data: ",data);
        payloads = [{ topic: 'test_result', messages: "Success"}];
        console.log("sending");
        let push_status = producer.send(payloads, (err, data) => {  
              if (err) {
                console.log('[kafka-producer -> test_result]: broker update failed');
              } else {
                console.log('[kafka-producer -> test_result]: broker update success!');
              }
        });
      });

  });



const PORT = 8082;
sess.listen(PORT, console.log(`Server at port ${PORT}`));