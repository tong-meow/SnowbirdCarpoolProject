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

    // address details
    add: string;
    city: string;
    state: string;
    zip: string;

    // initialized
    initialized: boolean;

    constructor(uid, email, photoURL, type, name, phone, address, 
                add, city, state, zip, initialized) {
        this.uid = uid;
        this.email = email;
        this.photoURL = photoURL;
        this.type = type;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.add = add;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.initialized = initialized;
    }
}
