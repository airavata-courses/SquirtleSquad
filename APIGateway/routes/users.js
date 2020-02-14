const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const kafka = require('kafka-node');
const axios = require('axios');

const Producer = kafka.Producer,
      client = new kafka.KafkaClient(),
      producer = new Producer(client);

async function publish(topic, message) {
    payloads = [{ topic: topic, messages: JSON.stringify(message)}];
    console.log("sending");
    let push_status = producer.send(payloads, (err, data) => {
        if (err) {
            console.log('[kafka-producer -> '+topic+']: broker update failed');
        } else {
            console.log('[Message:'+payloads[0].messages+' passed to '+topic+']: broker update success');    
        }
    });
}

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/logout', (req, res) => {
    const token = req.cookies['token'];
    jwt.verify(token, 'secretkey', (err, authData) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }
        console.log("\logout route:", authData._id);
        const message = {sessID: authData.sessID, userID: authData._id, action: {name:'logout'}, timeStamp: Date.now()}
        publish('addAction',message);
        res.clearCookie('token');
        res.redirect('/users/login');
        
    });
});
    

router.get('/dashboard', (req, res) => {
    const token = req.cookies['token'];
    jwt.verify(token, 'secretkey', (err, authData) => {
        if(err){
            console.log(err);
            res.send("Can't Log in")
        } else{
            res.render('dashboard');        
        }
    });
    
});

router.get('/getModel', async(req, res)=>{
    const token = req.cookies['token'];
    jwt.verify(token, 'secretkey', (err, authData) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }
        console.log("Sending ID:", authData._id);
        const message = {sessID: authData.sessID, userID: authData._id, action: {name:'ModelExecution', value: req.query.value}, timeStamp: Date.now()}
        console.log('Sending Model');
        publish('apigateway',message);
        
    });
    console.log('Sending Model');
})


//Post Methods
//register handler
router.post('/register', async (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];
    //Check all fields filled
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please fill in all fields.'});
    }
    //Check passwords match
    if(password!==password2){
        errors.push({msg : "Passwords don't match"});
    }

    //Can put more validations like, required chars in password, type of chars in pass.
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        const result = await axios.post(`http://localhost:8081/register?name=${name}&&email=${email}&&password=${password}`)
        .catch((error)=>{ console.log(error);
          });
        if(result.data.status == 'Success')
          res.redirect('/users/login');
        else
          res.send(result.data.msg);
    }
});


router.post('/login', async(req, res) =>{
    const result = await axios.get(`http://localhost:8081/login?email=${req.body.email}&&password=${req.body.password}`)
    .catch((error)=>{ console.log(error);
    });
    //console.log('result: ',result)
    if(result.data.status == 'Success'){
        const token = jwt.sign({_id: result.data._id, sessID: result.data.sessID},'secretkey');
        res.cookie('token', token,  {expire: 360000 + Date.now()});
        console.log('Setting Cookie');
        res.redirect('/users/dashboard');
    }
    else
        res.status(403);
});


router.get('/getState', (req, res)=>{
    console.log('Getting Latest Session');
    const token = req.cookies['token'];
    jwt.verify(token, 'secretkey', async (err, authData) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }
        console.log(authData._id);
        const result = await axios.get(`http://localhost:8082/getLastSession?userID=${authData._id}`);
        console.log(result.data);
        res.send(result.data);
    });
});

router.post('/setState', (req,res)=>{
    console.log('Getting Latest Session');
    const token = req.cookies['token'];
    jwt.verify(token, 'secretkey', async (err, authData) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }
        console.log(authData._id);
        console.log("Setting State");
        const message = {sessID: authData.sessID, userID: authData._id, action: {name:'state', value: req.query.value}, timeStamp: Date.now()}
        publish('addAction',message);
    });
});
//Uploading files

module.exports = router;