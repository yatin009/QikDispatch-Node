var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyAw8Xle1y6T2p6pu3mst3iJREqgDmFFj_A",
    authDomain: "ticketing-dev-87f05.firebaseapp.com",
    databaseURL: "https://ticketing-dev-87f05.firebaseio.com",
    storageBucket: "ticketing-dev-87f05.appspot.com",
    messagingSenderId: "625155435074"
};

firebase.initializeApp(config);

var database = firebase.database();

function createTicket(userId, name, email, imageUrl) {
    firebase.database().ref('ticketing/').set({
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}