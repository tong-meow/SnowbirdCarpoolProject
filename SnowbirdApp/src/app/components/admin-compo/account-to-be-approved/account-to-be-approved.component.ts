import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() accountProcessed = new EventEmitter<{ac: GoogleAccount}>();

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
      initialized: false
    }
    this.udataService.addUser(user);
    this.accountProcessed.emit({ac: this.accountObj});
  }

  onDenied(){
    if (window.confirm("Deny this user's registration?")) {
      this.gudataService.deleteAccount(this.accountObj).then(() => {
        this.accountProcessed.emit({ac: this.accountObj});
      })
      .catch(error => {
        console.log(error);
      })
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
      initialized: false
    }
    this.udataService.addUser(user);
    this.accountProcessed.emit({ac: this.accountObj});
  }

}
