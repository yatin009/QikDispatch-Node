/**
 * Created by yatin on 18/04/17.
 */
function RequesterData(msg, address, city) {
    this.issue = msg;
    this.priority = "HIGH";
    this.location = address;
    this.city = city
}

RequesterData.prototype.toJSONString = function () {
    return JSON.stringify({
        priority: this.priority,
        location: this.location,
        city: this.city,
        issue: this.issue
    });
}

RequesterData.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = RequesterData;