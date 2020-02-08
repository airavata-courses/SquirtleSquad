const express = require('express');
const router = express.Router();

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
        res.send('pass')
    }
});

module.exports = router;