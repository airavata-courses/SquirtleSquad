const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Session = require('./models/sessionmodel');
const SessionJobs = require('./models/sessionJobModel');
const sess = express();
sess.use(bodyParser.json());

//DB config
const db = require('./config/keys').MongoURI;

    var connectWithRetry = function() {
      return mongoose.connect("mongodb+srv://sathyan:1234@sathyan-cluster-jj8km.mongodb.net/test", function(err) {
        if (err) {
          console.error('Failed to connect to mongo on startup - retrying in 3 sec', err);
          setTimeout(connectWithRetry, 3000);
        }
        else{

          console.log('Session MongoDB Connected...');
        }
      });
    };
    connectWithRetry();

    
const kafka = require('kafka-node'),
    //Producer = kafka.Producer,
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient({kafkaHost:'kafka-service:9092'}),
    //client = new kafka.KafkaClient({kafkaHost:'localhost:9092'}),
    //producer = new Producer(client),
    consumer = new Consumer(client,[{ topic: 'addAction'}, { topic: 'apigateway'}, { topic: 'dataretrieval'}, { topic: 'modelexecution'},{ topic: 'postanalysis'}],{autoCommit: true});



sess.get('/getSessionID', async(req, res)=>{
  console.log('req query: ',req.query);
  //const { userId, timeStamp } = req.query;
  const rec = {userID: req.query.userID, timeStamp: req.query.timeStamp};
  console.log(rec);
  let session = new Session(rec);
  session.save(function(err, data){
     if(err) return console.error(err);
     else{
        let sessjobs = new SessionJobs({sessID: data._id, userID: req.query.userID, action: 'login', timeStamp: req.query.timeStamp});
        sessjobs.save(function (err, data2) {
          if (err) return console.error(err);
            console.log("Saved Data in sessJobs: ",data);
            res.json({_id: data._id, status: 'Success'});
        });       
     }
  })
});

sess.get('/loadResult', async(req,res)=>{
  console.log("sessionManagement: Getting Reult");
  state = SessionJobs.find({sessID: req.query.sessID, action: "postanalysis"})
  .then(async (jobs) => {
    if(jobs.length == 0){
      console.log("Nothing in LoadResult!");
      res.send("None");
    }
    else
    {
      console.log(jobs, jobs.length);
      console.log("Sending Result");
      res.send(jobs[0].value);
    }
});
});

sess.get('/getLastSession',async (req, res)=>{
  console.log("sessionManagement: Getting previous session");
  session = Session.find({userID: req.query.userID}).sort({timeStamp: -1}).limit(2)
            .then(session => {
              console.log("2nd Last Session",session);
              state = SessionJobs.find({sessID: session[1]._id, action: "state"}).sort({timeStamp: -1})
              .then(async (jobs) => {
                if(jobs.length == 0){
                  console.log("Nothing!!!!!");
                  res.send("None");
                }
                else
                {
                  console.log(jobs, jobs.length);
                  console.log("Restoring Jobs");
                  res.send(jobs[0].value);
                }
              });
            });
});

consumer.on('message', function (message) {
  console.log(message);
  if (message.length != 0){
    let sessjobs = new SessionJobs(JSON.parse(message.value));
    console.log("Saving Actions");
    sessjobs.save(function (err, data) {
      if (err) return console.error(err);
        console.log("Saved Data in sessJobs: ",data);
      });
    }
  });


const PORT = 8082;
sess.listen(PORT, console.log(`Server at port ${PORT}`));