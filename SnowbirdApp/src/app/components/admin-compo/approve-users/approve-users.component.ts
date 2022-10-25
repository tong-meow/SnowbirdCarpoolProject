import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { getFirestore } from "firebase/firestore";
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
  accounts: GoogleAccount[] = [];

  constructor(private gudataService: GudataService,
              private udataService: UdataService,
              private transferService: TransferService,
              private router: Router) { }


  ngOnInit(): void {

    // if the user hasn't logged in, nav to login page
    // if (this.udataService.user == undefined) {
    //   alert('Please log in first.');
    //   this.router.navigate(['login']);
    //   return;
    // }

    // if the user is not admin
    // if (this.udataService.user.type == 1) {
    //   alert('Only admin accounts are authorized to view this page!');
    //   this.router.navigate(['carpools']);
    //   return;
    // }
    
    this.getAccounts();
    if (this.accounts.length > 0) {
      this.noUsersToApprove = false;
    }
  }

  getAccounts(){
    this.gudataService.getAllAccounts().subscribe({
      next: (res) => 
        this.accounts = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          console.log("DATA------------------\n" + data);
          return data;
        }),
      error: (e) => alert('Error: Cannot fetch accounts data'),
      complete: () => console.info('complete') 
    });
  }
}
