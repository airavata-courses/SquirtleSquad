const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const app = express();
const kafka = require('kafka-node');
const utf8  = require('utf8');
const path = require('path');

//Cookies
app.use(cookieParser());

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//Setting static folder
app.use(express.static('../Data/'));

//Kafka pipelines
Producer = kafka.Producer;
Consumer = kafka.Consumer;
client = new kafka.KafkaClient();
producer = new Producer(client);
consumer = new Consumer(client,[{ topic: 'postanalysis'}],{autoCommit: true});

consumer.connect();

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

consumer.on('message', function(message) {
    console.log('connected', message);
    console.log("Message consumed:",message.value.toString());
    const decodedFile = utf8.decode(message.value);
    // app.get(`users\dashboard\PostAnalysis?imgName=${decodedFile}`, (req, res) => {
    //     img = new Buffer('../Data/'+decodedFile, "binary").toString("base64");
    //     res.render({img: img});
    // }); 
});

app.get('/getPlot',(req, res)=>{

})

app.get('/getModel', (req, res)=>{
    console.log('Sending Model');
    publish('apigateway', req.query.value);
})

producer.on('ready', async function() {
    const payloads = [{
        topic: 'apigateway',
        message: "Message for some service from apiGate."
    }];
    let push_status = producer.send(payloads, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log('message sent into TOPIC: apigateway');
         }
    });
});

producer.on('ready', async function() {
    const payloads = [{
        topic: 'apigateway',
        message: "Message for some service from apiGate."
    }];
    let push_status = producer.send(payloads, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log('message sent into TOPIC: apigateway');
         }
    });
});

producer.on('error', function(err) {
    console.log(err);
    console.log('[kafka-producer -> '+kafka_topic+']: connection errored');
    throw err;
});




/*
consumer.on('message', async function(message) {
    const decodedFile = utf8.decode(message.value);
    app.get(`users\dashboard\PostAnalysis?imgName=${decodedFile}`, (req, res) => {
        img = new Buffer('../Data/'+decodedFile, "binary").toString("base64");
        res.render({img: img});
    }); 
});
*/

    
//consumerAction.on('error', function(err) {
 //   console.log('error', err);
//});

// consumerPostAna.on('message', async function(message) {
//     console.log('here');
//     console.log(
//       'kafka-> ',
//       message.value
//     );
//   });
  
//   consumerAction.on('error', function(err) {
//     console.log('error', err);
//   });
  
//consumerPostAna.on('error', function(err) {
//    console.log('error', err);
//});




const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server at port ${PORT}`));

