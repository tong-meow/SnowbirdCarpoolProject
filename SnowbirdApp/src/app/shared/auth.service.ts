import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthProvider } from "firebase/auth";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GudataService } from 'src/app/shared/gudata.service';
import { GoogleAccount } from "../model/googleAccount";
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
        // private angularFireAuth: AngularFireAuth,
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
                    this.gudataService.checkGoogleAccount(this.account);
                    this.DirectUser();
                })
            }).catch((error) => {
                window.alert(error)
            })
    }

    // Firebase Google Sign-in
    SigninWithGoogle() {
        return this.OAuthProvider(new GoogleAuthProvider())
            .then(res => {
                console.log('Successfully logged in!')
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

    async DirectUser(){
        await this.udataService.userExists(this.account.uid);
        var userExists = this.udataService.hasCurrentUser();
        console.log(userExists);
        if (!userExists) {
            this.udataService.passAccountValue(this.account);
            this.router.navigate(['profile']);
        } else {
            this.router.navigate(['carpools']);
        }
    }
}