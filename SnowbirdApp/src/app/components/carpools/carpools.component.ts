import { Component, OnInit } from '@angular/core';
// router
import { Router } from "@angular/router";
// models
import { Carpool } from '../../model/carpool';
// services
import { UdataService } from 'src/app/shared/udata.service';
import { CpdataService } from 'src/app/shared/cpdata.service';


@Component({
  selector: 'app-carpools',
  templateUrl: './carpools.component.html',
  styleUrls: ['./carpools.component.css']
})
export class CarpoolsComponent implements OnInit {

    carpools: Carpool[] = []; 
    noCarpoolsToday: Boolean = true;

    constructor(private cpdataService: CpdataService,
                private udataService: UdataService,
                private router: Router) { }

    ngOnInit(): void {
        // if the user hasn't logged in, nav to login page
        if (this.udataService.user == undefined) {
          alert('Please log in first.');
          this.router.navigate(['login']);
          return;
        }
        // get all the carpools
        this.getAllCarpools();
        if (this.carpools.length > 0) {
          this.noCarpoolsToday = false;
        }
    }

    getAllCarpools() {
      this.cpdataService.getAllCarpools().subscribe({
        next: (res) => 
          this.carpools = res.map((e: any) => {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            return data;
          }),
        error: (e) => alert('Error: Cannot fetch carpool data'),
        complete: () => console.info('complete') 
      })
    }

    onCarpoolAdded() {
      // this.carpools.push(carpool);
      this.getAllCarpools();
      if (this.carpools.length > 0) {
        this.noCarpoolsToday = false;
      }
    }
  
}
