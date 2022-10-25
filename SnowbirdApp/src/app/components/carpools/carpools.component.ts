import { Component, Injectable, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
// router
import { Router } from "@angular/router";
// models
import { Carpool } from '../../model/carpool';
// services
import { UdataService } from 'src/app/shared/udata.service';
import { CpdataService } from 'src/app/shared/cpdata.service';
import { TransferService } from 'src/app/shared/transfer.service';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-carpools',
  templateUrl: './carpools.component.html',
  styleUrls: ['./carpools.component.css']
})
export class CarpoolsComponent implements OnInit {
    carpools: Carpool[] = []; 
    // noCarpoolsToday: Boolean = true;
    date: Date; // actual date on carpools page
    today: string; // for html placeholder
    dateWithPipe: string;
    pipe = new DatePipe('en-US');
    formGroup = new FormGroup({ releasedAt: new FormControl()});

    constructor(private cpdataService: CpdataService,
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
        // Set date as today on calendar input and get carpools from date
        this.date = new Date(); 
        this.date.setHours(0,0,0,0);
        this.dateWithPipe = this.pipe.transform(this.date, 'M/d/yy');
        this.today = this.dateWithPipe;
        
        // Get all carpools from date
        this.getAllCarpoolsFromDate(this.date);

    }

    async getAllCarpoolsFromDate(date: Date) {
      await this.cpdataService.getAllCarpoolsFromDate(date)
        .then(() => {
          this.carpools = this.transferService.getData();
          console.log("showing carpools on: " + date)
          this.transferService.clearData();
        })
    }

    // getAllCarpools() {
    //   this.cpdataService.getAllCarpools().subscribe({
    //     next: (res) => 
    //       this.carpools = res.map((e: any) => {
    //         const data = e.payload.doc.data();
    //         data.id = e.payload.doc.id;
    //         return data;
    //       }),
    //     error: (e) => alert('Error: Cannot fetch carpool data'),
    //     complete: () => console.info('complete') 
    //   })
    // }

    async onDateSelected(dateSelected) {
      // console.log(date)
      // console.log(typeof(date))
      this.date = dateSelected;
      console.log("New date selected: " + this.date);
      await this.getAllCarpoolsFromDate(this.date);
    }

    // Receive event emitted from AddCarpool child component and update carpools
    async onCarpoolAdded(dateFromAddCarpool) {
        console.log("Parent received new carpool event for: ", dateFromAddCarpool)
        await this.getAllCarpoolsFromDate(this.date)
        console.log("Carpools[] length after adding new carpool: " + this.carpools.length);
        window.location.reload()
        // this.router.navigate([this.router.url]);
      
    }

    async onCarpoolRemoved(carpoolId) {
      console.log("Parent received removed carpool event for carpool: " + carpoolId);
      await this.getAllCarpoolsFromDate(this.date)
    }
}
