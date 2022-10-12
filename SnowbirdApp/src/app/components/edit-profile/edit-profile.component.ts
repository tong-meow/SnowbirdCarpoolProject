import { Component, OnInit, EventEmitter, Output} from '@angular/core';
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
    addressText: string = "";
    photoURL: string = "";

    private account: GoogleAccount;
    private user: User;

    constructor(private gudataService: GudataService,
                private udataService: UdataService,
                private router: Router) {}
    
    ngOnInit(): void {

        // if the ACCOUNT is undefined, navigate to login
        if (this.gudataService.account == undefined) {
            alert('Please log in first.');
            this.router.navigate(['login']);
            return;
        }
        else {
            this.account = this.gudataService.account;
        }

        // if the USER is undefined
        if (this.udataService.user == undefined) {
            // set default value with google account data
            this.nameText = this.account.displayName;
            this.emailText = this.account.email;
            this.photoURL = this.account.photoURL;
        }
        // if the USER is assigned
        else {
            this.user = this.udataService.user;
            // set default value with user data
            this.nameText = this.user.name;
            this.phoneText = this.user.phone;
            this.emailText = this.user.email;
            this.addressText = this.user.address;
            this.photoURL = this.user.photoURL;
        }
    }

    // called when click "save" button
    onSaveUser(username: HTMLInputElement,
               phone: HTMLInputElement,
               email: HTMLInputElement,
               address: HTMLInputElement) {

        if (username.value == '' || address.value == '' ||
            phone.value == '' || email.value == '') {
            alert('Please fill in the forms.');
            return;
        }

        // if current user is undefined, save it to db
        if (this.udataService.user == undefined) {
            this.user = {
                uid: this.gudataService.account.uid,
                email: email.value,
                photoURL: this.gudataService.account.photoURL,
                type: 1,
                name: username.value,
                phone: phone.value,
                address: address.value,
                hasCar: false,
                carMake: '',
                carModel: '',
                carLicense: '',
                carSeatsAvail: 0
            };
            this.udataService.addUser(this.user).then(() => {
                this.router.navigateByUrl('/carpools');
            })
            .catch(error => {
                console.log("[EDIT PROFILE] " + error);
            });
        }
        // if current user exists, update it
        else {
            this.user.email = email.value;
            this.user.name = username.value;
            this.user.phone = phone.value;
            this.user.address = address.value;
            this.udataService.updateUser(this.user).then(() => {
                // route to carpools
                this.router.navigateByUrl('/carpools');
            })
            .catch(error => {
                console.log("[EDIT PROFILE] " + error);
            });
        }
    }
}