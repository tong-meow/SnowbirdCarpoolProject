export class Vehicle {
    // primary key, id for vehicle
    id: string;
    // foreign key, owner's id
    uid: string;
    // others
    make: string;
    model: string;
    license: string;
    seatsAvail: number;

    constructor(id, uid, make, model, license, seatsAvail) {
        this.id = id;
        this.uid = uid;
        this.make = make;
        this.model = model;
        this.license = license;
        this.seatsAvail = seatsAvail;
    }
}