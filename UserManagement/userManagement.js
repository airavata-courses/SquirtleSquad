const express = require('express');
const bcrypt = require('bcryptjs');
const kafka = require('kafka-node');
const user = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const axios = require('axios');
//sudo const cookieParser = require('cookie-parser')


const Producer = kafka.Producer,
      client = new kafka.KafkaClient({kafkaHost:'kafka:9092'}),
      //client = new kafka.KafkaClient({kafkaHost:'localhost:9092'}),
      producer = new Producer(client);

async function publish(topic, message) {
    payloads = [{ topic: topic, messages: JSON.stringify(message)}];
    console.log("sending");
    let push_status = producer.send(payloads, (err, data) => {
        if (err) {
            console.log('[kafka-producer -> '+topic+']: broker update failed');
        } else {
            console.log('[kafka-producer -> '+topic+']: broker update success');    
        }
    });
}

//DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('User MongoDB Connected...'))
    .catch(err => console.log(err));
//Post Methods
//register hsudo npm ndler
user.post('/register', (req, res) => {
    console.log(req.query)
    const {name, email, password} = req.query;
    //Validation pass
    User.findOne({email:email})
    .then(user => {
        if(user) {
            //User exist
            //console.log(req.body)
            result = {status:'Failure' , msg : 'Email already registered'};
            res.json(result);
        }
        else { 
            const newUser = new User({
                name,
                email,
                password
            });
            //Encrypting password
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    //Set password to ecrypted password
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        result = {status: "Success"}
                        res.json(result);
                    })
                    .catch(err => console.log(err));
                })
            );
        }
    });   
});



user.get('/login', async(req, res) =>{
    console.log(req.query.email, req.query.password);
    const userx = await User.findOne({
        email: req.query.email
    });
    //console.log(userx);
    if (!userx){
        const reqMsg = {_id: undefined, status: 'Failure'};
        res.json(reqMsg);
    }
    
    bcrypt.compare( req.query.password,userx.password).then(async(result)=>{
        if(!result){
            console.log(result," ",userx.password, " ",req.query.password)
            console.log('Wrong Password');
            const reqMsg = {_id: undefined, status: 'Failure'};
            res.json(reqMsg);
        }
        else
        {
            console.log('Login Success');
            const message = {sessID: userx._id, action: 'login', timeStamp: Date.now()}
            const result2 = await axios.get(`http://sessionmanagement:8082/getSessionID?userID=${userx._id}&&timeStamp=${Date.now()}`)
            //const result2 = await axios.get(`http://localhost:8082/getSessionID?userID=${userx._id}&&timeStamp=${Date.now()}`)
            .catch((error)=>{ console.log(error);
            });
            //console.log(result2);
            const sessID = result2.data._id;
            const reqMsg = {_id: userx._id, sessID: sessID, status: 'Success'};
            //console.log(reqMsg);
            res.json(reqMsg);    
        }
    });
    
});


const PORT = process.env.PORT || 8081;
user.listen(PORT, console.log(`Server at port ${PORT}`));