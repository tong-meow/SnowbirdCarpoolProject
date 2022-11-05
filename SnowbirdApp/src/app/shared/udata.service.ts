import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
// models
import { User } from '../model/user';
// services
import { GudataService } from './gudata.service';
import { TransferService } from './transfer.service';
import { LocalService } from './local.service';
// router
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root'
})

export class UdataService {

    /*  USER
        1. this user is the one who currently logged in
        2. it can be accessed by any components
        3. if a visitor hasn't logged in, this user should be 'undefined'
    */
    user: User;

    // other member variables
    app = initializeApp(environment.firebase);
    db = getFirestore(this.app);
    // userExists: boolean;

    constructor(private afs: AngularFirestore,
                private gudataService: GudataService,
                private transferService: TransferService,
                private localService: LocalService,
                private router: Router) { }


    // Check if a user exists
    async checkUser() {
        // get the uid from the Google Account
        var uid = this.gudataService.account.uid;
        // set the ref
        const usersRef = collection(this.db, "Users");
        // make a query
        const q = query(usersRef, where("uid", "==", uid));
        // fetch from the db
        const res = await getDocs(q);
        // if the user already exists in the db
        if (res.size > 0) {
            console.log("[UDATA SERVICE] User found.");
            // assign the USER member variable
            await this.assignUser(uid).then(
                // res => { this.userExists = true; }
            )
            .catch(error => {
                console.log("[UDATA SERVICE] " + error);
            });
        }
        // if the user doesnt exist, set userExists to false
        else {
            console.log("[UDATA SERVICE] User not found.");
            // this.userExists = false;
        }
    }

    // Assign the USER member variable
    async assignUser(uid: string){
        const usersRef = collection(this.db, "Users");
        const q = query(usersRef, where("uid", "==", uid));
        await getDocs(q).then(res => {
            if (res.size == 0) {
                console.log("[UDATA SERVICE] User not found.");
            }
            else {
                const docSnapshots = res.docs;
                for (var i in docSnapshots) {
                    const doc = docSnapshots[i].data();
                    const user: User = {
                        uid: doc["uid"],
                        email: doc["email"],
                        photoURL: doc["photoURL"],
                        type: doc["type"],
                        name: doc["name"],
                        phone: doc["phone"],
                        address: doc["address"],
                        add: doc['add'],
                        city: doc['city'],
                        state: doc['state'],
                        zip: doc['zip'],
                        initialized: doc['initialized']
                    };
                    this.user = user;
                    console.log("[UDATA SERVICE] USER is set.");
                }
            }
        })
        .catch(error => {
            console.log("[UDATA SERVICE] " + error);
        });
    }

    // Add a new user with Google Account data
    async addUser(user: User) {
        return this.afs.collection('/Users').doc(user.uid)
            .set({ 
                uid: user.uid,
                email: user.email,
                photoURL: user.photoURL,
                type: user.type,
                name: user.name,
                phone: user.phone,
                address: user.address,
                add: user.add,
                city: user.city,
                state: user.state,
                zip: user.zip,
                initialized: user.initialized
            })
            .then(res => {
                console.log("User added: " + user.name);
                console.log("[UDATA SERVICE] USER is set.");
            })
            .catch(error => {
                console.log("[UDATA SERVICE] " + error);
            });
    }

    // Update a new user
    async updateUser(user: User){
        await this.afs.collection('/Users').doc(user.uid).update({
            email: user.email,
            type: user.type,
            name: user.name,
            phone: user.phone,
            address: user.address,
            add: user.add,
            city: user.city,
            state: user.state,
            zip: user.zip,
            initialized: true
        }).then(res => {
            this.user = user;
            this.localService.saveLocalData("uid", this.user.uid);
            console.log("[UDATA SERVICE] USER is set.");
        }).catch(error => {
            console.log("[UDATA SERVICE] " + error);
        });
    }

    // Get a user with uid
    async getUser(uid: string) {
        var u: User;
        const usersRef = collection(this.db, "Users");
        const q = query(usersRef, where("uid", "==", uid));
        await getDocs(q).then(res => {
            if (res.size == 0) {
                console.log("[UDATA SERVICE] User not found.");
            }
            else {
                const docSnapshots = res.docs;
                for (var i in docSnapshots) {
                    const doc = docSnapshots[i].data();
                    u = {
                        uid: doc["uid"],
                        email: doc["email"],
                        photoURL: doc["photoURL"],
                        type: doc["type"],
                        name: doc["name"],
                        phone: doc["phone"],
                        address: doc["address"],
                        add: doc['add'],
                        city: doc['city'],
                        state: doc['state'],
                        zip: doc['zip'],
                        initialized: doc['initialized']
                    };
                    console.log("[UDATA SERVICE] User found.");
                }
                this.transferService.setData(u);
            }
        })
        .catch(error => {
            console.log("[UDATA SERVICE] " + error);
        });
    }

    async checkLoginStatus(){
        if (this.user == undefined) {
            const id = this.localService.getLocalData("uid");
            if (id != undefined) {
                await this.getUser(id).then(res => {
                    this.user = this.transferService.getData();
                    this.transferService.clearData();
                })
            }
            else {
                console.log("[UDATA SERVICE] " + "This user's data is not saved in local cache.");
                this.router.navigate(['login']);
            }
        }
    }
}
