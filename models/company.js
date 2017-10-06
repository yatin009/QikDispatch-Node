/**
 * Created by yatin on 05/10/17.
 */
function Company(usr, userRecord) {
    this.contactNumber = usr.contactNumber;
    this.name = usr.name;
    this.email = usr.emailId;
    this.organizationCode = usr.organizationCode;
    this.uniqueId = userRecord.uid;
    this.contractAgreement = "Variable";
    this.serviceList = null;
}

Company.prototype.toJSONString = function () {
    return JSON.stringify({
        contactNumber: this.contactNumber,
        name: this.name,
        email: this.email,
        contractAgreement: this.contractAgreement,
        organizationCode: this.organizationCode,
        uniqueId: this.uniqueId,
        serviceList: this.serviceList
    });
}

Company.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = Company;