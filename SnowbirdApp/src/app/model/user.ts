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

    constructor(uid, email, photoURL) {
        this.uid = uid;
        this.email = email;
        this.photoURL = photoURL;
    }
}
