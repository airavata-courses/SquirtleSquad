const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


//Set Storage Engines
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname + new Date().toISOString());
    }
});

const fileFilter = (req, file, cb) => {
    //Accept the below given types
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, false);
    } else {
        cb(null, true);
    }
}

const upload = multer({
    storage: storage,
    //limits: {
    //    filesize: 1024 * 1024 * 5
    //},
    //fileFilter: fileFilter
});

//Token FORMAT: Authorization : Bearer <access_token>
function verifyToken(req, res, next){ 
    //Get auth head value
    const token = req.header('auth-token');
    if(!token){
        return res.sendStatus(401);
    }
    try{
        const verify = jwt.token(token, 'secretkey');
        req.user = verify;
    } catch (err){
        res.sendStatus(400);
    }
    next();
}; 

//User model
const User = require('../models/User');

const File = require('../models/File');

//FGet methods
router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/logout', (req, res) => {
    res.redirect('/users/login');
})

router.get('/dashboard', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        } else{
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

/*
//Login handdling
router.post('/login', (req, res, next) => {
    User.findOne({
        email: req.body.email, 
        password: req.body.password
    }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        if(!user) {
            console.log(user);
            return res.status(500).send();
        }
        req.session.user = user;
        return res.status(200).send();
    });
});
/*
//Login handdling
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
        //session: false 
    })(req, res, next);
});
*/

router.post('/login', async(req, res) =>{
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user){
        return res.sendStatus(403);
    }
    
    const pass = await bcrypt.compare(user.password, req.body.password);
    if(!pass){
        res.sendStatus(403);
    }

    const token = jwt.sign({_id: user._id},'secretkey');
    res.header('auth-token', token).send(token);
    res.redirect('/users/dashboard')
});



//Uploading files
router.post('/upload', upload.single("myFile"),(req, res, next) => {
    console.log(req.file)
    
    const newFile = new File({
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        destination: req.file.destination,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
    })
    
    newFile.save().then( user => {
        req.flash('success_msg', 'File uploaded.');
        res.redirect('/users/dashboard');
    }).catch(err => console.log(err));    
});

module.exports = router;