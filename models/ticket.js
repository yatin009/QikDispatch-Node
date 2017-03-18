function Ticket(tweet, imageURL) {
    this.agentId = "4HyK2VKuffQvoY5cih8pM7NjGMr1";
    this.dateTime = tweet.created_at; //Add dateTime
    this.issueImage = imageURL;
    this.lat = 43.7854;
    this.lng = -79.2265;
    this.priority = "High";
    this.requestorId = "";
    this.searchKeyword = "";
    this.status = "Incoming";
    this.ticketKey = "";
    this.ticketNumber = "";
    // null parameters
    this.requestor = null
    this.approverId = null;
    this.contractorId = null;
    this.tweetId = tweet.id_str;
    this.issue = tweet.text;
}

function Ticket(date, image_url, id, msg) {
    this.agentId = "4HyK2VKuffQvoY5cih8pM7NjGMr1";
    this.dateTime = date; //tweet.created_at; //Add dateTime
    this.issueImage = image_url; //tweet.media[0].media_url; // Add image link
    this.lat = 43.7854;
    this.lng = -79.2265;
    this.priority = "High";
    this.requestorId = "";
    this.searchKeyword = "";
    this.status = "Incoming";
    this.ticketKey = "";
    this.ticketNumber = "";
    // null parameters
    this.requestor = null
    this.approverId = null;
    this.contractorId = null;
    this.tweetId = id; //tweet.id_str;
    this.issue = msg; //tweet.text;
}

Ticket.prototype.toJSONString = function () {
    return JSON.stringify({
        agentId: this.agentId,
        dateTime: this.dateTime,
        issueImage: this.issueImage,
        lat: this.lat,
        lng: this.lng,
        priority: this.priority,
        requestorId: this.requestorId,
        searchKeyword: this.searchKeyword,
        status: this.status,
        ticketKey: this.ticketKey,
        ticketNumber: this.ticketNumber,
        requestor: [],
        approverId: this.approverId,
        contractorId: this.contractorId,
        tweetId: this.tweetId,
        issue: this.issue
    });
}

Ticket.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = Ticket;