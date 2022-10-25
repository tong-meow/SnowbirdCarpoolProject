import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
// models
import { GoogleAccount } from '../model/googleAccount';
import { TransferService } from './transfer.service';


@Injectable({
    providedIn: 'root'
})

export class GudataService {

    /*  ACCOUNT
        1. this account is the google account who currently logged in
        2. it can be accessed by any components
        3. if a visitor hasn't logged in, this user should be 'undefined'
    */
    account: GoogleAccount;

    // other member variables
    app = initializeApp(environment.firebase);
    db = getFirestore(this.app);

    constructor(private afs: AngularFirestore,
                private transferService: TransferService) { }

    // Check the google account in
    // 1. if the account exists in db, do nothing
    // 2. if the account doesn't exisit, add it to the db
    // 3. set the ACCOUNT member variable
    async checkIn(ac: GoogleAccount) {
        // set the ref
        const accountsRef = collection(this.db, "GoogleAccounts");
        // make a query
        const q = query(accountsRef, where("uid", "==", ac.uid));
        // fetch from the db
        const res = await getDocs(q);
        // found the current account, get it and assign the ACCOUNT
        // update the db if necessary
        if (res.size > 0) {
            console.log("[GUDATA SERVICE] Google account found: " + ac.displayName);
            this.account = ac;
            console.log("[GUDATA SERVICE] ACCOUNT is set.");
            await this.updateGoogleAccount(ac).then()
            .catch(error => {
                console.log("[GUDATA SERVICE] " + error);
            });
        }
        // account not found, add to db
        else {
            console.log("[GUDATA SERVICE] Google account not found.");
            await this.addGoogleAccount(ac).then().catch(error => {
                console.log("[GUDATA SERVICE] " + error);
            });
        }
    }

    // Add a new google account to db
    async addGoogleAccount(ac: GoogleAccount) {
        return await this.afs.collection('/GoogleAccounts').doc(ac.uid)
            .set({
                uid: ac.uid,
                displayName: ac.displayName,
                email: ac.email,
                emailVerified: ac.emailVerified,
                photoURL: ac.photoURL
            })
            .then(res => {
                console.log("[GUDATA SERVICE] Google account added: " + ac.displayName);
                this.account = ac;
                console.log("[GUDATA SERVICE] ACCOUNT is set.");
            })
            .catch(error => {
                console.log("[GUDATA SERVICE] " + error);
            });
    }

    // Update a google user in db
    // only photoURL can be changed, don't change any other fields!!
    async updateGoogleAccount(account: GoogleAccount) {
        await this.afs.collection('/GoogleAccounts').doc(account.uid).update({
            photoURL: account.photoURL
        })
        .then(res => {
            console.log("[GUDATA SERVICE] Google account updated.");
        })
        .catch(error => {
            console.log("[GUDATA SERVICE] " + error);
        });
    }

    // Delete a google account in db
    // (Only when admin disapprove the user will this function be called)
    async deleteAccount(account: GoogleAccount) {
        await this.afs.doc('/GoogleAccounts/'+account.uid).delete()
        .then(() => {
            console.log("[GUDATA SERVICE] Google account deleted.");
        });
    }

    // Get all google accounts
    async getAllAccounts(){
        var acs: GoogleAccount[] = [];
        var ac: GoogleAccount;
        const acRef = collection(this.db, "GoogleAccounts");
        const q = query(acRef);
        await getDocs(q).then(res => {
            if (res.size == 0) {
                console.log("[GUDATA SERVICE] No accounts found.");
            }
            else {
                const docSnapshots = res.docs;
                for (var i in docSnapshots) {
                    const doc = docSnapshots[i].data();
                    ac = {
                        uid: doc["uid"],
                        email: doc["email"],
                        displayName: doc["displayName"],
                        photoURL: doc["photoURL"],
                        emailVerified: doc["emailVerified"]
                    };
                    console.log("[GUDATA SERVICE] Account found: " + ac.displayName);
                    acs.push(ac);
                }
                this.transferService.setData(acs);
            }
        })
        .catch(error => {
            console.log("[GUDATA SERVICE] " + error);
        });
    }
}
