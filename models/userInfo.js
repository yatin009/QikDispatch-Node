/**
 * Created by yatin on 21/06/17.
 */
function UserInfo(msg, address, city) {
    this.issue = msg;
    this.priority = "HIGH";
    this.location = address;
    this.city = city
}

function UserInfo(buildUser) {
    this.contactNumber = buildUser.contactNumber;
    this.name = buildUser.name;
    this.emailId = buildUser.email;
    this.isEnabled = true
}

UserInfo.prototype.toJSONString = function () {
    return JSON.stringify({
        contactNumber: this.contactNumber,
        name: this.name,
        email: this.email,
        isEnabled: this.isEnabled
    });
}

UserInfo.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = UserInfo;