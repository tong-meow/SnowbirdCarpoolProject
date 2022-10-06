import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { GoogleAccount } from '../model/googleAccount';
import { User } from '../model/user';


@Injectable({
    providedIn: 'root'
})

export class UdataService {
    app = initializeApp(environment.firebase);
    db = getFirestore(this.app);
    private hasThisUser: boolean;
    private uid;
    private displayName;
    private email;
    private photoURL;

    constructor(private afs: AngularFirestore) { }

    // // Firestore data converter
    // accountConverter = {
    //     toFirestore: (user: User) => {
    //         return {
    //             uid: user.uid,
    //             email: user.email,
    //             photoURL: user.photoURL,
    //             type: 1,
    //             name: user.name,
    //             phone: user.phone,
    //             address: user.address,
    //             hasCar: user.hasCar,
    //             carMake: user.carMake,
    //             carModel: user.carModel,
    //             carLicense: user.carLicense,
    //             carSeatsAvail: user.carSeatsAvail
    //             };
    //     },
    //     fromFirestore: (snapshot, options) => {
    //         const data = snapshot.data(options);
    //         const user: User = {
    //             uid: data.uid,
    //             email: data.email,
    //             photoURL: data.photoURL,
    //             type: data.type,
    //             name: data.name,
    //             phone: data.phone,
    //             address: data.address,
    //             hasCar: data.hasCar,
    //             carMake: data.carMake,
    //             carModel: data.carModel,
    //             carLicense: data.carLicense,
    //             carSeatsAvail: data.carSeatsAvail
    //         };
    //         return user;
    //     }
    // };

    // Check if a user exists
    async userExists(uid: string) {
        // set the ref
        const accountsRef = collection(this.db, "Users");
        // make a query
        const q = query(accountsRef, where("uid", "==", uid));
        // fetch from the db
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
            console.log("User found.");
            this.hasThisUser = true;
        }
        else {
            console.log("User not found.");
            this.hasThisUser = false;
        }
    }

    // Add a new user with Google Account data
    addUser(user: User) {
        const u: User = {
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            type: 1,
            name: user.name,
            phone: user.phone,
            address: user.address,
            hasCar: false,
            carMake: '',
            carModel: '',
            carLicense: '',
            carSeatsAvail: 0
        };
        console.log("User added: " + user.name);
        return this.afs.collection('/Users').add(u);
    }

    passAccountValue(account: GoogleAccount) {
        this.uid = account.uid;
        this.displayName = account.displayName;
        this.email = account.email;
        this.photoURL = account.photoURL;
    }

    getUid(){
        return this.uid;
    }

    getEmail(){
        return this.email;
    }

    getPhotoURL(){
        return this.photoURL;
    }

    getDisplayName(){
        return this.displayName;
    }

    hasCurrentUser(){
        return this.hasThisUser;
    }
}
