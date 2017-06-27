var express = require('express');

var config = require('./config');

var app = express()

app.set('port', (process.env.PORT || 5000));


let bodyParser = require(`body-parser`);
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// var router = express.Router(); 

app.use("/", require(`./controllers/twitterController.js`));
app.use("/", require(`./controllers/twilioController.js`));

// app.use("trust proxy", 1);


// var routes = require('./routes')(app);

app.listen(app.get('port'), function(){
    console.log('Server listening at port %s', app.get('port'));
});