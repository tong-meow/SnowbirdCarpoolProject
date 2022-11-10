export class Employee {
    uid: string;
    nameDisplayed: string;
    position: string;
    photoURL: string;

    constructor(uid, nameDisplayed, position, photo) {
        this.uid = uid;
        this.nameDisplayed = nameDisplayed;
        this.position = position;
        this.photoURL = photo;
    }
}