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
        private udataService: UdataService
    ) {
        this.afAuth.authState.subscribe(user => {
            this.account = user;
        })
    }

    // Firebase SignInWithPopup
    OAuthProvider(provider) {
        return this.afAuth.signInWithPopup(provider)
            .then((res) => {
                this.ngZone.run(() => {
                    // check in the current google account
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
                console.log('[AUTH SERVICE] Successfully logged in!')
            }).catch(error => {
                console.log(error)
            });
    }

    // Firebase Logout 
    SignOut() {
        return this.afAuth.signOut().then(() => {
            this.router.navigate(['login']);
        })
    }

    // Direct the user to either edit profile page or carpools page
    async DirectUser(){
        // check if customed user exists
        await this.udataService.checkUser().then(res => {
            if (!this.udataService.userExists) {
                this.router.navigate(['editprofile']);
            }
            else if (this.udataService.userExists) {
                this.router.navigate(['carpools']);
            }
            else {
                console.log('[AUTH SERVICE] User check failed.');
            }
        })
        .catch(error => {
            console.log('[AUTH SERVICE] ' + error);
        });
    }
}