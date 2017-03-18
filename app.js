var express = require('express');

var config = require('./config');

var app = express()

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })


// var router = express.Router(); 

app.use(`/`, require(`./controllers/twitterController.js`))



// var routes = require('./routes')(app);

app.listen(config.port, function(){
    console.log('Server %s listening at %s', config.serverName, app.url);
});