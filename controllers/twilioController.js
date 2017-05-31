/**
 * Created by yatin on 06/05/17.
 */
let router = require('express').Router();
let Ticket = require('../models/twilioTicket.js');
let twilio = require('twilio');
let admin = require('firebase-admin');
let async = require('async');
let NodeGeocoder = require('node-geocoder');

let options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    formatter: null         // 'gpx', 'string', ...
};
let geocoder = NodeGeocoder(options);

const accountSid = 'AC258924160f4455d78e2d2bbb3d320224'; // Your Account SID from www.twilio.com/console
const authToken = 'a0a2d7315ded3cc86b2d3abcd5177340';   // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

// Fetch the service account key JSON file contents
const serviceAccount = require("../QikDispatch-Dev-549fe5876000.json");

const database = admin.database();

router.get("/create_twilio_message", function (req, res) {
    client.messages.create({
        body: 'Hello from Node',
        to: '+1',  // Text this number
        from: '+16479302246' // From a valid Twilio number
    }, function (err, message) {
        if (!err) {
            res.status(200)
            res.send('Message Sent');
            console.log(message.sid);
        } else {
            res.status(err.status);
            res.send(err)
        }
    });
    //(message) => console.log(message.sid)
});

router.get("/get_twilio_message", function (req, res) {
    var messages = []
    client.messages.list(function (err, data) {
        if (!err) {
            data.forEach(function (message) {
                if (message.direction === 'inbound' && message.numMedia > 0) {
                    console.log(message.body);
                    messages.push(message)
                }
            });
            if (messages.length > 0) {
                filterValidMessage(messages, res);
            } else {
                res.status(200);
                res.send('No new messages');
            }
        } else {
            res.status(err.status);
            res.send(err)
        }
    });
});

function filterValidMessage(messages, res) {
    //TODO invalid messages array not used, to reply back user to message from registerred number.
    var validMessages = [], invalidMessage = [];
    let ref = database.ref("building_users");
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (childSnap) {
            var buildUser = childSnap.val();
            messages.forEach(function (message) {
                if (message.from.includes(buildUser.contactNumber)) {
                    message.buildingUser = buildUser;
                    validMessages.push(message);
                } else {
                    invalidMessage.push(message);
                }
            });
        });
        if (validMessages.length > 0) {
            checkDBForOldMessage(validMessages, res);
        } else {
            res.status(200);
            res.send('No new Messages');
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        res.status(402);
        res.send(errorObject.code);
    });
}

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
            downloadMediaUri(fTicketMessage, res);
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

function downloadMediaUri(messages, res) {
    async.forEachOf(messages, function (message, key, callback) {
        client.messages(message.sid).media.list(function (err, data) {
            if (err) {
                return callback(err);
            }

            data.forEach(function (media) {
                message.imageUri = parseImageUri(media.uri);
                callback();
            });
        });
    }, function (err) {
        if (err) {
            console.error(err.message);
            res.status(400);
            res.send(err);
        }
        ;
        // configs is now a map of JSON data
        createTicket(messages, res);
    });
}

function parseImageUri(imageLink) {
    return "https://api.twilio.com" + imageLink.substring(0, imageLink.length - 5);
}

function createTicket(fTicketMessage, res) {
    fTicketMessage.forEach(function (childMessage) {
        let location = childMessage.buildingUser.unitNumber + ", " + childMessage.buildingUser.address +
            ", " + childMessage.buildingUser.city + ", " + childMessage.buildingUser.proviance + ", " + childMessage.buildingUser.country;

        geocoder.geocode(location)
            .then(function (res) {
                pushTicket(new Ticket(
                    childMessage.dateCreated + '',
                    childMessage.sid,
                    childMessage.body,
                    res[0].latitude,
                    res[0].longitude,
                    res[0].formattedAddress,
                    childMessage.from,
                    res[0].city,
                    childMessage.imageUri));
                console.log(res);
            })
            .catch(function (err) {
                console.log(err);
            });
    });
    res.status(200)
    res.send('Tickets created from new messages ' + fTicketMessage.length);
}

function pushTicket(ticket){
    let newPostKey = database.ref("ticketing").push().key;
    ticket.ticketKey = newPostKey;
    // sendReply(ticket.requestorId, "", "");
    admin.database().ref("ticketing/" + newPostKey).set(
        ticket
    );
}

function sendReply(to, from, body) {
    client.messages.create({
        body: 'Thank you. A ticket has been created for your reported issue.',
        to: to,  // Text this number
        from: '+16479302246' // From a valid Twilio number
    });
}

module.exports = router;