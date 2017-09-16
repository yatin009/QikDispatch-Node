/**
 * Created by yatin on 05/09/17.
 */

function User(organization, userRecord) {
    this.agentId = userRecord.uid;
    this.password = "123456";
    this.role = "agent";
    this.organizationCode = organization.organizationCode;
    this.uniqueId = userRecord.uid;
    this.contactNumber = organization.contactNumber;
    this.name = organization.name;
    this.emailId = organization.email;
    this.enabled = true
}

User.prototype.toJSONString = function () {
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

User.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = User;