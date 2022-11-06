export class Vehicle {
    // primary key, id for vehicle
    license: string;
    // foreign key, owner's id
    uid: string;
    // others
    nickname: string;
    make: string;
    model: string;
    seatsAvail: number;

    constructor(license, uid, nickname, make, model, seatsAvail) {
        this.license = license;
        this.uid = uid;
        this.nickname = nickname;
        this.make = make;
        this.model = model;
        this.seatsAvail = seatsAvail;
    }
}