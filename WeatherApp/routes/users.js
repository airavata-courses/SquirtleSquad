const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//User model
const User = require('../models/User');


router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

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

//Login handdling
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});



module.exports = router;