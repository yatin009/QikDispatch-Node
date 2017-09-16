/**
 * Created by yatin on 05/09/17.
 */
let router = require('express').Router();
const admin = require('firebase-admin');
const dateFormat = require('dateformat');
let Organization = require('../models/organization.js');
let Contractor = require('../models/contractor.js');
let User = require('../models/user.js');
let ContractorUser = require('../models/contractorUser.js');
let FirebaseUser = require('../models/firebaseUser.js');

const database = admin.database();

router.post('/register_organization', function (req, res) {
    var org = req.body;
    createOrganizationCode(new Organization(org), res);
});

function createOrganizationCode(organization, res){
    getAllOrganizationCode(function(organizationCodes){
        if(organizationCodes === -1){
            res.status(500);
            res.send("Organization Codes from Firebase Error");
        }
        var bol=true, randomNumber;
        do{
            randomNumber = getRandomNumber();
            if(organizationCodes.indexOf(randomNumber) === -1){
                bol=false;
            }
        }while(bol);
        organization.organizationCode = randomNumber;
        organization.isEnabled = true;
        createOrganizationInFirebase(organization, res);
    });
}

function getRandomNumber(){
    return Math.floor(1000 + Math.random() * 9000);
}

function getAllOrganizationCode(callback){
    const ref = database.ref("organization");
    const organizationCodes = [];
    // Attach an asynchronous callback to read the data at our posts reference
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (childSnap) {
            organizationCodes.push(childSnap.val().organizationCode);
        });
        console.log('organizationCodes.length: ', organizationCodes.length);
        callback(organizationCodes);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        callback(-1);
    });
}

function createOrganizationInFirebase(organization, res){
    let newPostKey = database.ref("organization").push().key;
    organization.uniqueId = newPostKey;
    admin.database().ref("organization/" + newPostKey).set(
        organization
    );
    registerAgentInFirebase(organization, res);
}

function registerAgentInFirebase(organization, res){
    admin.auth().createUser({
        email: organization.email,
        emailVerified: true,
        phoneNumber: organization.contactNumber,
        password: "123456",
        displayName: organization.name,
        disabled: false
    }).then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);
        createAgentInFirebase(userRecord, organization, res);
    })
        .catch(function(error) {
            console.log("Error creating new user:", error);
            res.status(500);
            res.send("Error creating Agent in firebase authentication");
        });
}

function createAgentInFirebase(userRecord, organization, res){
    var agentUser = new User(organization, userRecord);
    admin.database().ref("users/" + agentUser.uniqueId).set(
        agentUser
    );
    res.status(200);
    res.send("Organization and Agent Created");
}

router.post('/register_contractor', function (req, res) {
    var con = req.body;
    console.log(con);
    registerContractorInFirebase(con, res);
});

function registerContractorInFirebase(contractor, res){
    admin.auth().createUser({
        email: contractor.email,
        emailVerified: true,
        phoneNumber: contractor.contactNumber,
        password: contractor.password,
        displayName: contractor.name,
        disabled: false
    }).then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);
        createContractorInFirebase(userRecord, contractor, res);
    })
        .catch(function(error) {
            console.log("Error creating new user:", error);
            res.status(500);
            res.send("Error creating Contractor in firebase authentication");
        });
}

function createContractorInFirebase(userRecord, contractor, res){
    var contractorUser = new Contractor(contractor, userRecord);
    admin.database().ref("contractors/" + contractorUser.uniqueId).set(
        contractorUser
    );

    var user = new ContractorUser(contractorUser, contractor);
    admin.database().ref("users/" + contractorUser.uniqueId).set(
        user
    );
    res.status(200);
    res.send("Contractor Created");
}

router.post('/register_user', function (req, res) {
    var usr = req.body;
    console.log(usr);
    registerUserInFirebase(con, res);
});

function registerUserInFirebase(usr, res){
    admin.auth().createUser({
        email: usr.email,
        emailVerified: true,
        phoneNumber: usr.contactNumber,
        password: usr.password,
        displayName: usr.name,
        disabled: false
    }).then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);
        createUserInFirebase(userRecord, contractor, res);
    })
        .catch(function(error) {
            console.log("Error creating new user:", error);
            res.status(500);
            res.send("Error creating Contractor in firebase authentication");
        });
}

function createUserInFirebase(userRecord, usr, res){
    var user = new FirebaseUser(usr, userRecord);
    admin.database().ref("users/" + user.uniqueId).set(
        user
    );
    res.status(200);
    res.send("User Created");
}

module.exports = router;