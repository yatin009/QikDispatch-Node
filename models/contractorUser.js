/**
 * Created by yatin on 16/09/17.
 */

function ContractorUser(contrator, userRecord) {
    this.agentId = contrator.uniqueId;
    this.password = userRecord.password;
    this.role = "contractor";
    this.organizationCode = contrator.organizationCode;
    this.uniqueId = contrator.uniqueId;
    this.contactNumber = contrator.contactNumber;
    this.name = contrator.name;
    this.emailId = contrator.email;
    this.enabled = true
}

ContractorUser.prototype.toJSONString = function () {
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

ContractorUser.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = ContractorUser;