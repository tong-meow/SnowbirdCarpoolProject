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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  // fileds text
  photoURL: string = "";
  nameText: string = "";
  phoneText: string = "";
  emailText: string = "";
  addressText: string = "";

  // user type
  noPermission: boolean = true;

  constructor(private gudataService: GudataService,
              private udataService: UdataService,
              private localService: LocalService,
              private router: Router) { }

  ngOnInit(): void {
    // if the ACCOUNT is undefined, navigate to login
    // if (this.gudataService.account == undefined) {
    //   alert('Please log in first.');
    //   this.router.navigate(['login']);
    //   return;
    // }
    this.gudataService.checkAccountStatus();
    this.udataService.checkLoginStatus().then(res => {
      this.photoURL = this.udataService.user.photoURL;
      this.nameText = this.udataService.user.name;
      this.phoneText = this.udataService.user.phone;
      this.emailText = this.udataService.user.email;
      this.addressText = this.udataService.user.address;
  
      if (this.udataService.user.type == 0) {
        this.noPermission = false;
      }
    })
    .catch(error => {
        console.log(error);
    });
  }

  onEdit() {
    this.router.navigate(['editprofile']);
    return;
  }

  onLogout() {
    this.gudataService.account = undefined;
    this.udataService.user = undefined;
    this.localService.removeLocalData("uid");
    this.localService.clearLocalData();
    this.router.navigate(['login']);
    return;
  }

  onAprroveUserReg(){
    // incase the regular users see this button!
    if (this.udataService.user.type != 0) {
      alert("Your account is not authorized to view and approve new registrations!");
      return;
    }
    // nav to approveusers
    this.router.navigate(['approveusers']);
    return;
  }
}
