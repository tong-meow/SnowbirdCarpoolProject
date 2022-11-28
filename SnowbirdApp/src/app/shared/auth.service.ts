import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthProvider } from "firebase/auth";
import { AngularFireAuth } from "@angular/fire/compat/auth";
// router
import { Router } from "@angular/router";
// models
import { GoogleAccount } from "../model/googleAccount";
// services
import { GudataService } from 'src/app/shared/gudata.service';
import { UdataService } from './udata.service';
import { LocalService } from './local.service';


@Injectable({
    providedIn: 'root'
})

export class AuthService {
    account: GoogleAccount;
    constructor(
        public router: Router,
        public ngZone: NgZone,
        public afAuth: AngularFireAuth,
        private gudataService: GudataService,
        private udataService: UdataService,
        private localService: LocalService
    ) {
        this.afAuth.authState.subscribe(act => {
            this.account = act;
        })
    }

    // Firebase SignInWithPopup
    OAuthProvider(provider) {
        return this.afAuth.signInWithPopup(provider)
            .then((res) => {
                this.ngZone.run(() => {
                    // STEP 1: CHECK IN THE CURRENT GOOGLE ACCOUNT
                    this.gudataService.checkIn(this.account).then(res => {
                        this.DirectUser();
                    })
                    .catch(error => {
                        console.log("[AUTH SERVICE] " + error);
                    })
                })
            }).catch((error) => {
                window.alert(error)
            })
    }

    // Firebase Google Sign-in
    SigninWithGoogle() {
        return this.OAuthProvider(new GoogleAuthProvider())
            .then(res => {
                // console.log('[AUTH SERVICE] Successfully logged in!')
            }).catch(error => {
                console.log(error)
            });
    }

    // Firebase Logout 
    SignOut() {
        return this.afAuth.signOut().then(() => {
            this.udataService.user = undefined;
            this.gudataService.account = undefined;
            this.localService.removeLocalData("uid");
            this.localService.clearLocalData();
            this.router.navigate(['login']);
        })
    }

    // STEP 2: Direct the user to either edit profile page or carpools page
    async DirectUser(){
        await this.udataService.checkUser().then(res => {
            if (this.udataService.user == undefined) {
                this.router.navigate(['notice']);
            }
            else{
                // if the "initialized" field is false
                // this means the current user is approved by an admin
                // but this is the first time of logging in
                if (!this.udataService.user.initialized){
                    // nav to edit profile, let the user initialize the data first
                    this.router.navigate(['editprofile']);
                }
                // if the user has been logged in before
                else {
                    // add to local cache
                    this.localService.saveLocalData("uid", this.udataService.user.uid);
                    // console.log('[AUTH SERVICE] ' + "The user data has been added to local cache.");
                    // nav to carpools
                    this.router.navigate(['carpools']);
                }
            }
        })
        .catch(error => {
            console.log('[AUTH SERVICE] ' + error);
        });
    }
}