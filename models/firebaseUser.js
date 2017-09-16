/**
 * Created by yatin on 16/09/17.
 */

function FirebaseUser(usr, userRecord) {
    this.agentId = usr.agentId;
    this.password = usr.password;
    this.role = usr.role;
    this.organizationCode = usr.organizationCode;
    this.uniqueId = userRecord.uid;
    this.contactNumber = usr.contactNumber;
    this.name = usr.name;
    this.emailId = usr.email;
    this.enabled = true
}

FirebaseUser.prototype.toJSONString = function () {
    return JSON.stringify({
        agentId: this.agentId,
        password: this.password,
        role: this.role,
        organizationCode: this.organizationCode,
        uniqueId: this.uniqueId,
        contactNumber: this.contactNumber,
        name: this.name,
        emailId: this.emailId,
        enabled: this.enabled
    });
}

FirebaseUser.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = FirebaseUser;