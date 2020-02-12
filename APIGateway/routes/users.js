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
                console.log('[kafka-producer -> '+topic+']: broker update success');    
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
        console.log(authData._id);
        const message = {sessID: authData._id, action: 'logout', timeStamp: Date.now()}
        res.clearCookie('token');
        publish('addAction',message);

        res.redirect('/users/login');
    });
});
    

router.get('/dashboard', (req, res) => {
    console.log(5);
    const token = req.cookies['token'];
    jwt.verify(token, 'secretkey', (err, authData) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        } else{
            console.log(8);
            res.render('dashboard');        
        }
    });
    
});




//Post Methods
//register handler
router.post('/register', (req, res) => {
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
        //Validation pass
        User.findOne({email:email})
        .then(user => {
            if(user) {
                //User exist
                console.log(req.body)
                errors.push({msg : 'Email already registered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
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
                            req.flash('success_msg', 'You are now registered.');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    })
                );
            }
        });
    }
});


router.post('/login', async(req, res) =>{
    const result = await axios.post(`http://localhost:8081/login?email=${req.body.email}&&password=${req.body.password}`,  {
                    email: req.body.email,
                    password: req.body.password
                
    }).catch((error)=>{
        console.log(error);
        });
    console.log('result: ',result)
    if(result.data.status == 'Success'){
        const token = jwt.sign({_id: result.data._id},'secretkey');
        res.cookie('token', token,  {expire: 360000 + Date.now()});
        console.log('Setting Cookie');
        res.redirect('/users/dashboard');
    }
    else
        res.status(403);
});



//Uploading files

module.exports = router;