/**
 * Created by yatin on 05/10/17.
 */
function Building(building, agentId) {
    this.address = building.address;
    this.buildingObjectKey = "";
    this.city = building.city;
    this.contactNumber = building.contactNumber;
    this.country = building.country;
    this.email = building.email;
    this.floors = building.floors;
    this.name = building.name;
    this.postalCode = building.postalCode;
    this.proviance = building.proviance;
    this.userId = agentId
}

Building.prototype.toJSONString = function () {
    return JSON.stringify({
        address: this.address,
        buildingObjectKey: this.buildingObjectKey,
        city: this.city,
        contactNumber: this.contactNumber,
        country: this.country,
        email: this.email,
        floors: this.floors,
        name: this.name,
        postalCode: this.postalCode,
        proviance: this.proviance,
        userId: this.userId
    });
}

Building.prototype.print = function () {
    console.log(this.toJSONString());
}

module.exports = Building;