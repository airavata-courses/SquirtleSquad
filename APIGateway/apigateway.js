const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const app = express();
const kafka = require('kafka-node');

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

//Kafka pipelines
Producer = kafka.Producer;
Consumer = kafka.Consumer;
client = new kafka.KafkaClient();
producer = new Producer(client);
consumerAction = new Consumer(client,[{ topic: 'addAction'}],{autoCommit: true});
consumerPostAna = new Consumer(client,[{ topic: 'postanalysis'}],{autoCommit: true});


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




consumerPostAna.on('message', async function(message) {
    console.log('here');
    console.log(
      'kafka-> ',
      message.value
    );
  });
  
  consumerAction.on('error', function(err) {
    console.log('error', err);
  });
  
  consumerPostAna.on('error', function(err) {
    console.log('error', err);
  });

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server at port ${PORT}`));

