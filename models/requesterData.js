/**
 * Created by yatin on 18/04/17.
 */
function RequesterData(msg) {
    this.issue = msg;
    this.priority = "HIGH";
    this.location = "Dummy location";
    this.city = "Dummy city"
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