/**
 * Created by yatin on 05/09/17.
 */

function User(organization, userRecord, isContractor) {
    if(!isContractor) {
        this.agentId = userRecord.uid;
        this.password = "123456";
        this.role = "agent";
        this.organizationCode = organization.organizationCode;
        this.uniqueId = userRecord.uid;
        this.contactNumber = organization.contactNumber;
        this.name = organization.name;
        this.emailId = organization.email;
        this.enabled = true
    }else{
        this.password = userRecord.password;
        this.role = "contractor";
        this.organizationCode = contrator.organizationCode;
        this.uniqueId = contrator.uniqueId;
        this.contactNumber = contrator.contactNumber;
        this.name = contrator.name;
        this.emailId = contrator.email;
        this.enabled = true
    }
}

function User(contrator) {

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