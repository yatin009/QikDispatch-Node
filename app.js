const express = require('express');
const config = require('./config');
const app = express()
const admin = require('firebase-admin');

app.set('port', (process.env.PORT || 5000));


let bodyParser = require(`body-parser`);
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// var router = express.Router(); 

// Fetch the service account key JSON file contents
const serviceAccount = require("./QikDispatch-Dev-549fe5876000.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://qikdispatch-dev.firebaseio.com/"
});

app.use("/", require(`./controllers/twitterController.js`));
app.use("/", require(`./controllers/twilioController.js`));

// app.use("trust proxy", 1);


// var routes = require('./routes')(app);

app.listen(app.get('port'), function(){
    console.log('Server listening at port %s', app.get('port'));
});