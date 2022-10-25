import { Component, OnInit, Input } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { getFirestore } from "firebase/firestore";
// router
import { Router } from "@angular/router";
// models
import { GoogleAccount } from "src/app/model/googleAccount";
import { User } from "src/app/model/user";
// services
import { GudataService } from 'src/app/shared/gudata.service';
import { UdataService } from 'src/app/shared/udata.service';

@Component({
  selector: 'app-account-to-be-approved',
  templateUrl: './account-to-be-approved.component.html',
  styleUrls: ['./account-to-be-approved.component.css']
})
export class AccountToBeApprovedComponent implements OnInit {

  @Input() accountObj: GoogleAccount;

  constructor(private gudataService: GudataService,
              private udataService: UdataService) { }

  ngOnInit(): void {
  }

  onApprove(){
    const user: User = {
      uid: this.accountObj.uid,
      email: this.accountObj.email,
      photoURL: this.accountObj.photoURL,
      type: 1,
      name: this.accountObj.displayName,
      phone: "",
      address: "",
      add: "",
      city: "",
      state: "",
      zip: "",
    }
    // this.udataService.addUser(user);
  }

  onDisapprove(){
    if (window.confirm('Disapprove this user?')) {
      this.gudataService.deleteAccount(this.accountObj);
    }
  }

  onApproveAsAdmin(){
    const user: User = {
      uid: this.accountObj.uid,
      email: this.accountObj.email,
      photoURL: this.accountObj.photoURL,
      type: 0,
      name: this.accountObj.displayName,
      phone: "",
      address: "",
      add: "",
      city: "",
      state: "",
      zip: "",
    }
    // this.udataService.addUser(user);
  }

}
