/**
 * Created by yatin on 18/04/17.
 */
var UserInfo = require('../models/userInfo.js');

function RequesterData(msg, address, city, buildUser) {
    if (buildUser) {
        this.issue = msg;
        this.priority = "HIGH";
        this.location = buildUser.unitNumber + ", " + buildUser.address;
        this.city = buildUser.city;
        this.userInfo = new UserInfo(buildUser);
        return;
    }
    this.issue = msg;
    this.priority = "HIGH";
    this.location = address;
    this.city = city;
}

RequesterData.prototype.toJSONString = function () {
    return JSON.stringify({
        priority: this.priority,
        location: this.location,
        city: this.city,
        issue: this.issue,
        userInfo: this.userInfo
    });
}

RequesterData.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = RequesterData;