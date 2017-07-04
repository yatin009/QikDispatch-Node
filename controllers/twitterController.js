let router = require('express').Router();
const Twitter = require('twitter');
const Ticket = require('../models/twitterTicket.js');
const admin = require('firebase-admin');
const NodeGeocoder = require('node-geocoder');
const dateFormat = require('dateformat');
const options = {
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    formatter: null         // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

const database = admin.database();
const client = new Twitter({
    consumer_key: 'lxM4lEOBEQ2gXeTw9Eo2Pl9To',
    consumer_secret: 'pimTKJmL1CT8nziAeL8h4nQOsBYdOlucewDQQZLhWOz9AXWXHe',
    access_token_key: '832350932730015745-XV8V2QHVNGfzzVO4VMEE86QnqKH9EUf',
    access_token_secret: 'XA9IdAWpF4KIfHktU5CM4zT1g6KhbMr3nHR4dSqldpSUf',
});

var tickets = [];

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
                res.status(200);
                res.send('No mention tweets');
            }
        } else {
            res.status(500);
            res.send(error);
        }
    });
});

function checkDBForOldTweets(tweets, res) {
    const fTweetsid = [];
    const fTicketTweet = [];
    const ref = database.ref("ticketing");
    // Attach an asynchronous callback to read the data at our posts reference
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (childSnap) {
            const tweetSnap = childSnap.val();
            tickets.push(tweetSnap);
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
            res.status(200);
            res.send('No new tweets');
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        res.status(402);
        res.send(errorObject.code);
    });
}

function createTicket(fTicketTweet, res) {
    const tickets = [];
    fTicketTweet.forEach(function (childTweet) {
        var imageURL = null, lat, lng;
        if (childTweet.entities.media) {
            imageURL = childTweet.entities.media[0].media_url;
        }
        if (childTweet.coordinates && childTweet.coordinates.coordinates) {
            lng = childTweet.coordinates.coordinates[0];
            lat = childTweet.coordinates.coordinates[1];
            geocoder.reverse({lat: lat, lon: lng})
                .then(function (res) {
                    const geoTicket = new Ticket(
                        dateFormat(childTweet.created_at, "mm-dd-yyyy HH:MM")+"",
                        imageURL,
                        childTweet.id_str,
                        childTweet.text,
                        lat,
                        lng,
                        res[0].formattedAddress,
                        res[0].city);

                    const newPostKey = database.ref("ticketing").push().key;
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
                dateFormat(childTweet.created_at, "mm-dd-yyyy HH:MM")+"",
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
        const newPostKey = database.ref("ticketing").push().key;
        ticket.ticketKey = newPostKey;
        admin.database().ref("ticketing/" + newPostKey).set(
            ticket
        );

    });
    res.status(200);
    res.send('Tickets created from new tweet ' + fTicketTweet.length);
}

router.get('/test_function', function (req, res) {
    console.log("test_function Started >> ",new Date()+"");
    getTicketNumber(function (ticketNumber) {
        console.log('Ticket number count: ', ticketNumber);
        if(ticketNumber === -1){
            return null;
        }
        console.log('Ticket number created');
    });
    console.log("test_function ended >> ",new Date()+"")
});

function getTicketNumber(callback) {
    console.log("getTicketNumber Started >> ",new Date()+"");
    const ref = database.ref("ticketing");
    const tickets = [];
    // Attach an asynchronous callback to read the data at our posts reference
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (childSnap) {
            tickets.push(childSnap.val());
        });
        console.log('tickets.length: ', tickets.length);
        updateAnalytics(tickets);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        callback(-1);
    });
}

function updateAnalytics(tickets){

    var myMap = new Map();
    tickets.forEach(function(ticket){
        const tDate = formatTicketDate(ticket.dateTime);
        if(myMap.get(tDate)){
            tArray = myMap.get(tDate);
            tArray.push(ticket);
            myMap.set(tDate, tArray);
        }else{
            var tArray = [];
            tArray.push(ticket);
            myMap.set(tDate, tArray);
        }
    });

    const todaysDate = dateFormat(new Date(), "mm-dd-yyyy");
    let incomingCount = 0, dispatchedCount = 0, approvalCount = 0, approvedCount = 0, sceduledCount = 0,
        workCompletedCount = 0, workRatedCount = 0;
    let highCount = 0, mediumCount = 0, lowCount = 0;

    tickets.forEach(function (ticket) {
        if (todaysTicket(ticket, todaysDate)) {
            switch (ticket.status) {
                case "Incoming":
                    incomingCount++;
                    break;
                case "Assigned":
                    dispatchedCount++;
                    break;
                case "Approver Assigned":
                    approvalCount++;
                    break;
                case "Approved":
                    approvedCount++;
                    break;
                case "Scheduled":
                    sceduledCount++;
                    break;
                case "Work Completed":
                    workCompletedCount++;
                    break;
                case "WorkRated":
                    workRatedCount++;
                    break;
                default:
                    break;
            }

            switch (ticket.priority) {
                case "HIGH":
                    highCount++;
                    break;
                case "MEDIUM":
                    mediumCount++;
                    break;
                case "LOW":
                    lowCount++;
                    break;
                default:
                    break;
            }
        }
    });

    analytic.analyticsDate = todaysDate;
    analytic.incomingCount = incomingCount;
    analytic.dispatchedCount = dispatchedCount;
    analytic.approvalCount = approvalCount;
    analytic.approvedCount = approvedCount;
    analytic.scheduleCount = sceduledCount;
    analytic.workCompletedCount = workCompletedCount;
    analytic.workRatedCount = workRatedCount;

    analytic.highCount = highCount;
    analytic.mediumCount = mediumCount;
    analytic.lowCount = lowCount;

    const ref = database.ref("analytics");
    ref.update(analytic);
    console.log("Update Analytics called >> ",new Date()+"")
}

function formatTicketDate(ticketDate){
    console.log(ticketDate);
    return dateFormat(ticketDate, "mm-dd-yyyy");
}

function todaysTicket(ticket, todaysDate) {
    console.log("Ticket Date BEFORE FORMATT", ticket.dateTime);
    const ticketDate = dateFormat(ticket.dateTime, "mm-dd-yyyy");
    console.log("Ticket Date", ticketDate);
    console.log("Todays Date", todaysDate);
    console.log("(ticketDate === todaysDate)", (ticketDate === todaysDate));
    return (ticketDate === todaysDate);
}

module.exports = router;