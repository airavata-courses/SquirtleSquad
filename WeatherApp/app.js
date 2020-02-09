const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');


//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));




// Then use it before your routes are set up:
app.use(cors());

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Public Folder
app.use(express.static('./public'));

//BodyParser
app.use(express.urlencoded({extended: false}));

//Epress session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//Passport middlware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());
app.use(bodyParser.json());
app.use(cookieParser())
//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
//app.use('/', require('./routes/SessionManager'));

const kafka = require('kafka-node');


let Producer = kafka.Producer,
client = new kafka.KafkaClient(),
producer = new Producer(client);


 async function publish(topic, message) {
    payloads = [
        { topic: topic, messages: JSON.stringify(message)}
    ];
    //console.log("Data ready to send to ",topic," ",message);
    
        console.log("sending");
        let push_status = producer.send(payloads, (err, data) => {
          if (err) {
            console.log('[kafka-producer -> '+topic+']: broker update failed');
          } else {
            console.log('[kafka-producer -> '+topic+']: broker update success');
          }
        });
     
     
}

let i = 0;
app.post('/send', (req, res) => {
    console.log(req.body, i);
    i = i+1;
    publish('test',req.body);

});
const PORT = 8080;

app.listen(PORT, console.log(`Server at port ${PORT}`));
