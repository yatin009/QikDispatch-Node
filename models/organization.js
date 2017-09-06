/**
 * Created by yatin on 05/09/17.
 */
function Organization(organization) {
    this.contactNumber = organization.contactNumber;
    this.name = organization.name;
    this.email = organization.email;
    this.address = organization.address;
    this.organizationCode = organization.organizationCode;
    this.uniqueId = organization.uniqueId;
    this.isEnabled = organization.isEnabled;
}

Organization.prototype.toJSONString = function () {
    return JSON.stringify({
        contactNumber: this.contactNumber,
        name: this.name,
        email: this.email,
        address: this.address,
        organizationCode: this.organizationCode,
        uniqueId: this.uniqueId,
        isEnabled: this.isEnabled
    });
}

Organization.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = Organization;