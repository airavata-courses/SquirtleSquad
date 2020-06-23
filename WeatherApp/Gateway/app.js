const express = require('express');
const app = express();
const Kafka = require('kafka-node');

//BodyParser
app.use(express.urlencoded({extended: false}));

//Routes
app.use('/sessionManagement', require('./api/sessionManagement'));
app.use('/userManagement', require('./api/userManagement'));

var Producer = Kafka.Producer;
var client = new Kafka.KafkaClient();
var producer = new Producer(client);


app.get("./apiGateway", (req, res) => { 
    producer.on("ready", () => {
        console.log("ready");
        const message = req.tag;
        //default port
        var port = 5003;
        if (message === "sess") port = 5004;
        if (message === "user") port = 5005;  
        setInterval(() => {
            payloads = [{topic: "test", 
                         message: "hi"}];
            producer.send(payloads, (err, data) => {
                console.log(data);
            });
        },port);
    });
    
    producer.on("error", () => {
        console.log(err);
    });    
    
});






const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server at port ${PORT}`));