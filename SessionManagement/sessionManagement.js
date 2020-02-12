const express = require('express');
const sess = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Session = require('./models/sessionmodel');
const SessionJobs = require('./models/sessionJobModel');

sess.use(bodyParser.json());

//DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('Session MongoDB Connected...'))
    .catch(err => console.log(err));

const kafka = require('kafka-node'),
    //Producer = kafka.Producer,
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(),
    //producer = new Producer(client),
    consumer = new Consumer(client,[{ topic: 'addAction'}],{autoCommit: true});



sess.get('/getSessionID', async(req, res)=>{
  console.log('req query: ',req.query);
  //const { userId, timeStamp } = req.query;
  const rec = {userID: req.query.userID, timeStamp: req.query.timeStamp};
  console.log(rec);
  let session = new Session(rec);
  session.save(function(err, data){
     if(err) return console.error(err);
     else{
        let sessjobs = new SessionJobs({sessID: data._id, userID: req.query.userID, action: {name: 'login' }, timeStamp: req.query.timeStamp});
        sessjobs.save(function (err, data2) {
          if (err) return console.error(err);
            console.log("Saved Data in sessJobs: ",data);
            res.json({_id: data._id, status: 'Success'});
        });       
     }
  })
});

consumer.on('message', function (message) {
  console.log(message);
  let sessjobs = new SessionJobs(JSON.parse(message.value));
  sessjobs.save(function (err, data) {
    if (err) return console.error(err);
      console.log("Saved Data in sessJobs: ",data);
    });
});



const PORT = 8082;
sess.listen(PORT, console.log(`Server at port ${PORT}`));