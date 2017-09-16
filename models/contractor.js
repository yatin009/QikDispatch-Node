/**
 * Created by yatin on 15/09/17.
 */

function Contractor(contractor, userRecord) {
    this.companyName = contractor.companyName;
    this.name = contractor.name;
    this.contactNumber = contractor.contactNumber;
    this.email = contractor.email;
    this.isEnabled = contractor.isEnabled;
    if(userRecord) {
        this.uniqueId = userRecord.uid;
    }
    this.serviceType = contractor.serviceType;
    this.companyId = contractor.companyId;
    this.organizationCode = contractor.organizationCode;
}

// Contractor.prototype.toJSONString = function () {
//     return JSON.stringify({
//         agentId: this.agentId,
//         password: this.password,
//         role: this.role,
//         organizationCode: this.organizationCode,
//         uniqueId: this.uniqueId,
//         contactNumber: this.contactNumber,
//         name: this.name,
//         emailId: this.emailId,
//         enabled: this.enabled
//     });
// }

Contractor.prototype.print = function () {
    console.log(this.toJSONString());
};

module.exports = Contractor;
