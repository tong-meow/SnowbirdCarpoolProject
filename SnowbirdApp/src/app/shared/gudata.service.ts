import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { GoogleAccount } from '../model/googleAccount';


@Injectable({
    providedIn: 'root'
})

export class GudataService {
    app = initializeApp(environment.firebase);
    db = getFirestore(this.app);

    constructor(private afs: AngularFirestore) { }

    // Firestore data converter
    accountConverter = {
        toFirestore: (account: GoogleAccount) => {
            return {
                uid: account.uid,
                email: account.email,
                displayName: account.displayName,
                photoURL: account.photoURL,
                emailVerified: account.emailVerified
                };
        },
        fromFirestore: (snapshot, options) => {
            const data = snapshot.data(options);
            const account: GoogleAccount = {
                uid: data.uid,
                displayName: data.displayName,
                email: data.email,
                emailVerified: data.emailVerified,
                photoURL: data.photoURL
            };
            return account;
        }
    };

    // Add a google user to db
    addGoogleAccount(account: GoogleAccount) {
        const user: GoogleAccount = {
            uid: account.uid,
            displayName: account.displayName,
            email: account.email,
            emailVerified: account.emailVerified,
            photoURL: account.photoURL
        };
        console.log("Google account added: " + account.displayName);
        return this.afs.collection('/GoogleAccounts').add(user);
    }

    // Check if a google account exists
    async checkGoogleAccount(account: GoogleAccount) {
        // set the ref
        const accountsRef = collection(this.db, "GoogleAccounts");
        // make a query
        const q = query(accountsRef, where("uid", "==", account.uid));
        // fetch from the db
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
            console.log("Google account found: " + account.displayName);
        }
        else {
            console.log("Google account not found.");
            this.addGoogleAccount(account);
        }
    }
}
