import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { getFirestore } from "firebase/firestore";
// router
import { Router } from "@angular/router";
// models
import { GoogleAccount } from "../../model/googleAccount";
import { User } from '../../model/user';
// services
import { GudataService } from '../../shared/gudata.service';
import { UdataService } from 'src/app/shared/udata.service';
import { LocalService } from 'src/app/shared/local.service';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})

export class EditProfileComponent implements OnInit {
  
    app = initializeApp(environment.firebase);
    db = getFirestore(this.app);

    // fields used in html, for default display
    nameText: string = "";
    phoneText: string = "";
    emailText: string = "";
    addText: string = "";
    cityText: string = "";
    stateText: string = "";
    zipText: string = "";
    photoURL: string = "";

    noPermission: boolean = true;

    private account: GoogleAccount;
    private user: User;

    constructor(private gudataService: GudataService,
                private udataService: UdataService,
                private localService: LocalService,
                private router: Router) {}
    
    ngOnInit(): void {

        this.gudataService.checkAccountStatus().then(res => {
            this.account = this.gudataService.account;
        })
        .catch(error => {
            console.log(error);
        });

        this.udataService.checkLoginStatus().then(res => {
            this.user = this.udataService.user;

            // if the USER has not initialized yet
            if (!this.udataService.user.initialized) {
                // set default value with google account data
                this.nameText = this.account.displayName;
                this.emailText = this.account.email;
                this.photoURL = this.account.photoURL;
            }
            // if the USER is already initialized
            else {
                this.noPermission = false;
                // set default value with user data
                this.nameText = this.user.name;
                this.phoneText = this.user.phone;
                this.emailText = this.user.email;
                this.addText = this.user.add;
                this.cityText = this.user.city;
                this.stateText = this.user.state;
                this.zipText = this.user.zip;
                this.photoURL = this.user.photoURL;
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    // called when click "save" button
    onSaveUser(username: HTMLInputElement,
               phone: HTMLInputElement,
               email: HTMLInputElement,
               add: HTMLInputElement,
               city: HTMLInputElement,
               state: HTMLInputElement,
               zip: HTMLInputElement) {

        if (username.value == '' || phone.value == '' || email.value == '' ||
            add.value == '' || city.value == '' || state.value == '' || zip.value == '') {
            alert('Please fill out the forms.');
            return;
        }

        var address = add.value + ", " + city.value + ", " + state.value + " " + zip.value;

        this.user.email = email.value;
        this.user.name = username.value;
        this.user.phone = phone.value;
        this.user.address = address;
        this.user.add = add.value;
        this.user.city = city.value;
        this.user.state = state.value;
        this.user.zip = zip.value;
        this.user.initialized = true;
        this.udataService.updateUser(this.user).then(() => {
            // update local cache
            if (this.localService.getLocalData("uid") == undefined) {
                this.localService.saveLocalData("uid", this.user.uid);
            }
            // route to profiles
            this.router.navigateByUrl('/profile');
        })
        .catch(error => {
            console.log("[EDIT PROFILE] " + error);
        });
    }
}