import { Component, OnInit, Input, Output } from '@angular/core';
import { Carpool } from '../../model/carpool';
import { CpdataService } from '../../shared/cpdata.service';
import { Router } from "@angular/router";
import { UdataService } from 'src/app/shared/udata.service';

@Component({
    selector: 'app-carpool',
    templateUrl: './carpool.component.html',
    styleUrls: ['./carpool.component.css']
})
export class CarpoolComponent implements OnInit {
    // @Input() element: {driver: string, passengers: string[], startTime: string, totalSeats: number};
    // @Input() driver: string;
    @Input() carpoolObj: Carpool;

    carFull = false;

    constructor(private cpdataService: CpdataService,
                private udataService: UdataService,
                private router: Router){}

    ngOnInit(): void {
        // if the user hasn't logged in, nav to login page
        if (this.udataService.user == undefined) {
            alert('Please log in first.');
            this.router.navigate(['login']);
            return;
        }
    }

    onJoinCarpool() {
        // !TODO: should we push user obj or just name?
        this.carpoolObj.passengers.push(this.udataService.user.name);
        // console.log("in onJoinCarpool");
        this.cpdataService.updateCarpoolPassengers(this.carpoolObj, this.carpoolObj.passengers);
    }

    // onJoinCarpool() {
    //   this.element.passengers.push("User");
    //   if (this.element.passengers.length == this.element.totalSeats) {
    //     this.carFull = true;
    //   }
    // }

    onCancelCarpool() {
        if (window.confirm('Delete this carpool?')) {
            this.cpdataService.deleteCarpool(this.carpoolObj);
        }
    }

    getRemainingSeats() {
      // console.log("no. of passengers: " + this.carpoolObj.passengers.length);
      // console.log("no. of seats: " + this.carpoolObj.totalSeats);

      if (this.carpoolObj.passengers.length == this.carpoolObj.totalSeats) {
          this.carFull = true;
          // console.log("setting bool car is full");
      }
      return (this.carpoolObj.totalSeats - this.carpoolObj.passengers.length);
    }

}
