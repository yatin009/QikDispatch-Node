/**
 * Created by yatin on 30/04/17.
 */

function TicketTimeline(name, status) {
    this.basicInfo = "";
    this.dateTime = "26-04-2017 00:05 AM";
    this.name = name;
    this.status = status
}

TicketTimeline.prototype.toJSONString = function () {
    return JSON.stringify({
        basicInfo: this.basicInfo,
        dateTime: this.dateTime,
        name: this.name,
        status: this.status
    });
}

TicketTimeline.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = TicketTimeline;
