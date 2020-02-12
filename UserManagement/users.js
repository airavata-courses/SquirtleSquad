const express = require('express');
const bcrypt = require('bcryptjs');
const kafka = require('kafka-node');
const user = express();
const mongoose = require('mongoose');
const User = require('./models/User');
//sudo const cookieParser = require('cookie-parser')


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

//DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('User MongoDB Connected...'))
    .catch(err => console.log(err));
//Post Methods
//register hsudo npm ndler
user.post('/register', (req, res) => {
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



user.post('/login', async(req, res) =>{
    console.log(req.query.email, req.query.password);
    const userx = await User.findOne({
        email: req.query.email
    });
    console.log(userx);
    if (!userx){
        const reqMsg = {_id: undefined, status: 'Failure'};
        res.json(reqMsg);
    }
    
    bcrypt.compare( req.query.password,userx.password).then((result)=>{
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
            const reqMsg = {_id: userx._id, status: 'Success'};
            publish('addAction',message);
            res.json(reqMsg);    
        }
    });
    
});


const PORT = process.env.PORT || 8081;
user.listen(PORT, console.log(`Server at port ${PORT}`));