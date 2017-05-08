let router = require('express').Router();
var Twitter = require('twitter');
var Ticket = require('../models/ticket.js');
var admin = require('firebase-admin');
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);


// Fetch the service account key JSON file contents
var serviceAccount = require("../QikDispatch-Dev-549fe5876000.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://qikdispatch-dev.firebaseio.com/"
});

// Ticketing-DEV firebase
// var config = {
//     apiKey: "AIzaSyAw8Xle1y6T2p6pu3mst3iJREqgDmFFj_A",
//     authDomain: "ticketing-dev-87f05.firebaseapp.com",
//     databaseURL: "https://ticketing-dev-87f05.firebaseio.com",
//     storageBucket: "ticketing-dev-87f05.appspot.com",
//     messagingSenderId: "625155435074"
// };

var client = new Twitter({
    consumer_key: 'lxM4lEOBEQ2gXeTw9Eo2Pl9To',
    consumer_secret: 'pimTKJmL1CT8nziAeL8h4nQOsBYdOlucewDQQZLhWOz9AXWXHe',
    access_token_key: '832350932730015745-XV8V2QHVNGfzzVO4VMEE86QnqKH9EUf',
    access_token_secret: 'XA9IdAWpF4KIfHktU5CM4zT1g6KhbMr3nHR4dSqldpSUf',
});

// Yatin-DEV twitter credentials
// var client = new Twitter({
//     consumer_key: '9kRe4r7PJbiHwkoVK1KkOFG95',
//     consumer_secret: 'mG1NPIj3S4vucIQ09gBgvcDBtvnbflxOclVe2HKMOZvllocey7',
//     access_token_key: '833049257527619584-NUz5QHsBuqjQsGZ8hdt1ZC4xZwrJCu5',
//     access_token_secret: 'PJKa242M2wnfRGN6XZhsEaqaK8jxpYyre00xtkitZse97'
// });

var database = admin.database();

router.get("/", function (req, res) {
    res.send('Hello World!')
});

router.get('/get_mention_tweets', function (req, res) {
    // https://dev.twitter.com/rest/reference/get/statuses/user_timeline
    client.get('statuses/mentions_timeline.json', {
        screen_name: 'nodejs',
        count: 20
    }, function (error, tweets, response) {
        if (!error) {
            if (tweets.length > 0) {
                checkDBForOldTweets(tweets, res)
            } else {
                res.status(200)
                res.send('No mention tweets');
            }
        } else {
            res.status(500)
            res.send(error);
        }
    });
});

function checkDBForOldTweets(tweets, res) {
    var fTweetsid = [];
    var fTicketTweet = [];
    var ref = database.ref("ticketing");
    // Attach an asynchronous callback to read the data at our posts reference
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (childSnap) {
            var tweetSnap = childSnap.val();
            if (tweetSnap.tweetId) {
                fTweetsid.push(tweetSnap.tweetId);
            }
        });
        tweets.forEach(function (childTweet) {
            if (fTweetsid.indexOf(childTweet.id_str) == -1) {
                fTicketTweet.push(childTweet);
            }
        });
        if (fTicketTweet.length > 0) {
            createTicket(fTicketTweet, res);
        } else {
            res.status(200)
            res.send('No new tweets');
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        res.status(402)
        res.send(errorObject.code);
    });
}

function createTicket(fTicketTweet, res) {
    var tickets = [];
    fTicketTweet.forEach(function (childTweet) {
        var imageURL = null, lat, lng;
        if (childTweet.entities.media) {
            imageURL = childTweet.entities.media[0].media_url;
        }
        if (childTweet.coordinates && childTweet.coordinates.coordinates) {
            lng = childTweet.coordinates.coordinates[0]
            lat = childTweet.coordinates.coordinates[1];
            geocoder.reverse({lat: lat, lon: lng})
                .then(function (res) {
                    var geoTicket = new Ticket(
                        childTweet.created_at,
                        imageURL,
                        childTweet.id_str,
                        childTweet.text,
                        lat,
                        lng,
                        res[0].formattedAddress,
                        res[0].city);

                    var newPostKey = database.ref("ticketing").push().key;
                    geoTicket.ticketKey = newPostKey;
                    admin.database().ref("ticketing/" + newPostKey).set(
                        geoTicket
                    );
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
        else {
            lat = 43.7854;
            lng = -79.2265;
            tickets.push(new Ticket(
                childTweet.created_at,
                imageURL,
                childTweet.id_str,
                childTweet.text,
                lat,
                lng,
                "Dummy Address",
                "Dummy City"))
        }
    });
    tickets.forEach(function (ticket) {
        var newPostKey = database.ref("ticketing").push().key;
        ticket.ticketKey = newPostKey;
        admin.database().ref("ticketing/" + newPostKey).set(
            ticket
        );

    })
    res.status(200)
    res.send('Tickets created from new tweet ' + fTicketTweet.length);
}

module.exports = router;