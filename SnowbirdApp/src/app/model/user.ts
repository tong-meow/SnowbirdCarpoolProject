export class User {
    // same from google
    uid: string;
    email: string;
    photoURL: string;

    // custom fields
    type: number; // 0 - admin, 1 - regular user
    name: string;
    phone: string;
    address: string;
    hasCar: boolean;

    // fields of vehicles
    // carIDs -> replace with a list of IDs when we have car model
    carMake: string;
    carModel: string;
    carLicense: string;
    carSeatsAvail: number;

    constructor(uid, email, photoURL) {
        this.uid = uid;
        this.email = email;
        this.photoURL = photoURL;
    }
}
