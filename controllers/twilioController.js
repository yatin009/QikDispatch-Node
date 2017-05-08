/**
 * Created by yatin on 06/05/17.
 */
let router = require('express').Router();
var Ticket = require('../models/ticket.js');
var twilio = require('twilio');
var admin = require('firebase-admin');

var accountSid = 'AC258924160f4455d78e2d2bbb3d320224'; // Your Account SID from www.twilio.com/console
var authToken = 'a0a2d7315ded3cc86b2d3abcd5177340';   // Your Auth Token from www.twilio.com/console

var client = new twilio(accountSid, authToken);

// Fetch the service account key JSON file contents
var serviceAccount = require("../QikDispatch-Dev-549fe5876000.json");

var database = admin.database();

router.get("/create_twilio_message", function (req, res) {
    client.messages.create({
        body: 'Hello from Node',
        to: '+1',  // Text this number
        from: '+16479302246' // From a valid Twilio number
    }, function(err, message) {
        if(!err){
            res.status(200)
            res.send('Message Sent');
            console.log(message.sid);
        }else{
            res.status(err.status);
            res.send(err)
        }
    });
    //(message) => console.log(message.sid)
});

router.get("/get_twilio_message", function (req, res) {
    var messages = []
    client.messages.list(function(err, data) {
        if(!err){
            data.forEach(function(message) {
                if(message.direction == 'inbound') {
                    console.log(message.body);
                    messages.push(message)
                }
            });
            if(messages.length>0){
                checkDBForOldMessage(messages, res)
            }else {
                res.status(200)
                res.send('No new messages');
            }
        }else{
            res.status(err.status);
            res.send(err)
        }
    });
});


function checkDBForOldMessage(messages, res) {
    var fMessagesid = [];
    var fTicketMessage = [];
    var ref = database.ref("ticketing");
    // Attach an asynchronous callback to read the data at our posts reference
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (childSnap) {
            var messageSnap = childSnap.val();
            if (messageSnap.messageId) {
                fMessagesid.push(messageSnap.messageId);
            }
        });
        messages.forEach(function (childMessage) {
            if (fMessagesid.indexOf(childMessage.sid) == -1) {
                fTicketMessage.push(childMessage);
            }
        });
        if (fTicketMessage.length > 0) {
            createTicket(fTicketMessage, res);
        } else {
            res.status(200)
            res.send('No new Messages');
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        res.status(402)
        res.send(errorObject.code);
    });
}

function createTicket(fTicketMessage, res) {
    var tickets = [];
    fTicketMessage.forEach(function (childMessage) {
        var imageURL = null, location;
        if (false) {//childTweet.coordinates && childTweet.coordinates.coordinates
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
        }  else {
            lat = 43.7854;
            lng = -79.2265;
            tickets.push(new Ticket(
                childMessage.dateCreated,
                childMessage.sid,
                childMessage.body,
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
    res.send('Tickets created from new tweet ' + fTicketMessage.length);
}

module.exports = router;