let router = require('express').Router();
var Twitter = require('twitter');
var Ticket = require('../models/ticket.js');
var firebase = require('firebase');


var config = {
    apiKey: "AIzaSyCg2T_aFhlzdkUr6P6uespjRjqjSzLeKjo",
    authDomain: "qikdispatch-dev.firebaseapp.com",
    databaseURL: "https://qikdispatch-dev.firebaseio.com",
    projectId: "qikdispatch-dev",
    storageBucket: "qikdispatch-dev.appspot.com",
    messagingSenderId: "888975173548"
};

// Ticketing-DEV
// var config = {
//     apiKey: "AIzaSyAw8Xle1y6T2p6pu3mst3iJREqgDmFFj_A",
//     authDomain: "ticketing-dev-87f05.firebaseapp.com",
//     databaseURL: "https://ticketing-dev-87f05.firebaseio.com",
//     storageBucket: "ticketing-dev-87f05.appspot.com",
//     messagingSenderId: "625155435074"
// };

var client = new Twitter({
    consumer_key: 'YW4MyUnbuiyQFmpiU4AeilHRD' ,//'9kRe4r7PJbiHwkoVK1KkOFG95',
    consumer_secret: 'PfH64R8HP7N2ivKykkUP8u8JYZGpUqg2EQlzYVy04YCZbuY3gX',//'mG1NPIj3S4vucIQ09gBgvcDBtvnbflxOclVe2HKMOZvllocey7',
    access_token_key: '832350932730015745-KAFttBaaCHyWQzHNuo2X3s0qoHAOyYS',//'833049257527619584-NUz5QHsBuqjQsGZ8hdt1ZC4xZwrJCu5',
    access_token_secret: 'AOMjMa7wk1UxXRHJCabFNuoWfF15yuIfNvNXfWFjfqh5F',//'PJKa242M2wnfRGN6XZhsEaqaK8jxpYyre00xtkitZse97'
});

firebase.initializeApp(config);
var database = firebase.database();

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
            checkDBForOldTweets(tweets, res)
        } else {
            res.status(500).json({
                error: error
            });
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
        createTicket(fTicketTweet, res);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function createTicket(fTicketTweet, res) {
    var tickets = [];
    fTicketTweet.forEach(function (childTweet) {
        var imageURL = "", lat, lng;
        if (childTweet.entities.media) {
            imageURL = childTweet.entities.media[0].media_url;
        }
        if (childTweet.coordinates && childTweet.coordinates.coordinates) {
            lng = childTweet.coordinates.coordinates[0]
            lat = childTweet.coordinates.coordinates[1];
        } else {
            lat = 43.7854;
            lng = -79.2265;
        }
        tickets.push(new Ticket(
            childTweet.created_at,
            imageURL,
            childTweet.id_str,
            childTweet.text,
            lat,
            lng))
    });
    tickets.forEach(function (ticket) {
        var newPostKey = database.ref("ticketing").push().key;
        ticket.ticketKey = newPostKey;
        firebase.database().ref("ticketing/" + newPostKey).set(
            ticket
        );

    })
    res.status(200)
    res.send('Success from tweets');
}

module.exports = router;