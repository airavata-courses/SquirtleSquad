const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const app = express();



app.use(cookieParser());
app.use(bodyParser.json());


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({extended: false}));

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server at port ${PORT}`));

