var RequesterData = require('../models/requesterData.js');
var TicketTimeline = require('../models/ticketTimeline.js');


function Ticket(tweet, imageURL) {
    this.agentId = "4HyK2VKuffQvoY5cih8pM7NjGMr1";
    this.dateTime = tweet.created_at; //Add dateTime
    this.issueImageName = imageURL;
    this.lat = 43.7854;
    this.lng = -79.2265;
    this.priority = "HIGH";
    this.requestorId = "";
    this.searchKeyword = "";
    this.status = "Incoming";
    this.ticketKey = "";
    this.ticketNumber = "";
    this.ticketTimelines = new TicketTimeline();
// null parameters
    this.requestor = null
    this.approverId = null;
    this.contractorId = null;
    this.tweetId = tweet.id_str;
    this.issue = tweet.text;
}

function Ticket(date, image_url, id, msg, lat, lng, address, city) {
    this.agentId = "4HyK2VKuffQvoY5cih8pM7NjGMr1";
    this.dateTime = date; //tweet.created_at; //Add dateTime
    this.issueImageName = image_url; //tweet.media[0].media_url; // Add image link
    this.lat = lat;//43.7854;
    this.lng = lng;//-79.2265;
    this.priority = "HIGH";
    this.requestorId = "";
    this.searchKeyword = "";
    this.status = "Incoming";
    this.ticketKey = "";
    this.ticketNumber = "";
    this.requester = new RequesterData(msg, address, city)
    this.ticketTimelines = ticketTimeline;
    // null parameters
    this.approverId = null;
    this.contractorId = null;
    this.tweetId = id; //tweet.id_str;
    this.issue = msg; //tweet.text;
}

function Ticket(date, id, msg, lat, lng, address, city) {
    this.agentId = "4HyK2VKuffQvoY5cih8pM7NjGMr1";
    this.dateTime = date; //tweet.created_at; //Add dateTime
    this.issueImageName = ""; //tweet.media[0].media_url; // Add image link
    this.lat = lat;//43.7854;
    this.lng = lng;//-79.2265;
    this.priority = "HIGH";
    this.requestorId = "";
    this.searchKeyword = "";
    this.status = "Incoming";
    this.ticketKey = "";
    this.ticketNumber = "";
    this.requester = new RequesterData(msg, address, city)
    this.ticketTimelines = ticketTimeline;
    // null parameters
    this.approverId = null;
    this.contractorId = null;
    this.messageId = id; //tweet.id_str;
    this.issue = msg; //tweet.text;
}

var ticketTimeline = {
    "0": new TicketTimeline("Incoming", "COMPLETED"),
    "1": new TicketTimeline("Assigned", "PENDING"),
    "2": new TicketTimeline("Approver Assigned", "PENDING"),
    "3": new TicketTimeline("Approved", "PENDING"),
    "4": new TicketTimeline("Scheduled", "PENDING"),
    "5": new TicketTimeline("Work Completed", "PENDING"),
    "6": new TicketTimeline("WorkRated", "PENDING")
}

// function TicketTimelines() {
//     var ticketTimeline = new Array();
//     ticketTimeline.push(new TicketTimeline("Incoming", "COMPLETED"));
//     ticketTimeline.push(new TicketTimeline("Assigned", "PENDING"));
//     ticketTimeline.push(new TicketTimeline("Approver Assigned", "PENDING"));
//     ticketTimeline.push(new TicketTimeline("Approved", "PENDING"));
//     ticketTimeline.push(new TicketTimeline("Scheduled", "PENDING"));
//     ticketTimeline.push(new TicketTimeline("Work Completed", "PENDING"));
//     ticketTimeline.push(new TicketTimeline("WorkRated", "PENDING"));
//     return ticketTimeline;
// }

Ticket.prototype.toJSONString = function () {
    return JSON.stringify({
        agentId: this.agentId,
        dateTime: this.dateTime,
        issueImageName: this.issueImageName,
        lat: this.lat,
        lng: this.lng,
        priority: this.priority,
        requestorId: this.requestorId,
        searchKeyword: this.searchKeyword,
        status: this.status,
        ticketKey: this.ticketKey,
        ticketNumber: this.ticketNumber,
        requester: this.requester.print(),
        approverId: this.approverId,
        contractorId: this.contractorId,
        ticketTimelines: this.ticketTimelines,
        tweetId: this.tweetId,
        issue: this.issue
    });
}

Ticket.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = Ticket;