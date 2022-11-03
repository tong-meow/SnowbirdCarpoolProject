import { Component, OnInit } from '@angular/core';
// router
import { Router } from "@angular/router";
// models
import { GoogleAccount } from "src/app/model/googleAccount";
// services
import { GudataService } from 'src/app/shared/gudata.service';
import { UdataService } from 'src/app/shared/udata.service';
import { TransferService } from 'src/app/shared/transfer.service';

@Component({
  selector: 'app-approve-users',
  templateUrl: './approve-users.component.html',
  styleUrls: ['./approve-users.component.css']
})

export class ApproveUsersComponent implements OnInit {

  noUsersToApprove: boolean = true;
  allAccounts: GoogleAccount[] = [];
  accounts: GoogleAccount[] = [];

  constructor(private gudataService: GudataService,
              private udataService: UdataService,
              private transferService: TransferService,
              private router: Router) { }


  ngOnInit(): void {

    // if the user hasn't logged in, nav to login page
    if (this.udataService.user == undefined) {
      alert('Please log in first.');
      this.router.navigate(['login']);
      return;
    }

    // if the user is not admin
    if (this.udataService.user.type != 0) {
      alert('Only admin accounts are authorized to view this page!');
      this.router.navigate(['carpools']);
      return;
    }
    
    this.getGoogleAccounts().then(() => {
      this.filter().then(() => {
        if (this.accounts.length > 0) {
          this.noUsersToApprove = false;
        }
      });
    });
  }

  async getGoogleAccounts(){
    await this.gudataService.getAllAccounts().then(() => {
      this.allAccounts = this.transferService.getData();
      console.log(this.allAccounts.length + " google accounts fetched.");
      this.transferService.clearData();
    })
  }

  async filter(){
    for(var i = 0; i < this.allAccounts.length; i++){
      console.log("FILTER PROCESS: " + this.allAccounts[i].displayName);
      await this.udataService.getUser(this.allAccounts[i].uid).then(() => {
        const user = this.transferService.getData();
        this.transferService.clearData();
        if (user == undefined) {
          this.accounts.push(this.allAccounts[i]);
        }
      });
    }
    console.log(this.accounts.length + " accounts wait to be approved.");
  }

  onProcessed(account) {
    var index = this.accounts.indexOf(account);
    this.accounts.splice(index, 1);
  }
}
