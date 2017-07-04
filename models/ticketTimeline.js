/**
 * Created by yatin on 30/04/17.
 */

function TicketTimeline(name, status, date) {
    this.basicInfo = "";
    this.dateTime = date;
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
