const express = require('express');
const sess = express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Session = require('./models/sessionmodel');

sess.use(bodyParser.json());
sess.use(cookieParser())

//DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(),
    consumer = new Consumer(
        client,
        [
            { topic: 'test'}
        ],
        {
            autoCommit: true
        }
    );

    consumer.on('message', function (message) {
      console.log(message);
      let sess = new Session(JSON.parse(message.value));
      sess.save(function (err, data) {
        if (err) return console.error(err);
        console.log("Saved Data: ",data);
      });
  });

  const PORT = 5000;

sess.listen(PORT, console.log(`Server at port ${PORT}`));