var express = require('express');

var config = require('./config');

var app = express()

app.set('port', (process.env.PORT || 5000));


// var router = express.Router(); 

app.use(`/`, require(`./controllers/twitterController.js`))



// var routes = require('./routes')(app);

app.listen(app.get('port'), function(){
    console.log('Server listening at port %s', app.get('port'));
});