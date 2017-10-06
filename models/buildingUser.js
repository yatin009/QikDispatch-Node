/**
 * Created by yatin on 05/10/17.
 */
function BuildingUser(usr, building) {
    this.address = usr.address;
    this.city = usr.city;
    this.contactNumber = usr.contactNumber;
    this.country = usr.country;
    this.email = usr.email;
    this.floorNumber = usr.floorNumber;
    this.name = usr.name;
    this.role = usr.role;
    this.postalCode = usr.postalCode;
    this.proviance = usr.proviance;
    this.agentId = building.userId;
    this.buildingId = building.buildingObjectKey;
}

BuildingUser.prototype.toJSONString = function () {
    return JSON.stringify({
        address: this.address,
        city: this.city,
        contactNumber: this.contactNumber,
        country: this.country,
        email: this.email,
        floorNumber: this.floorNumber,
        name: this.name,
        postalCode: this.postalCode,
        proviance: this.proviance,
        role: this.role,
        agentId: this.agentId,
        buildingId: this.buildingId,
    });
};

BuildingUser.prototype.print = function () {
    console.log(this.toJSONString());
};

module.exports = BuildingUser;