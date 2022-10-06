import { Component, OnInit, Input, Output } from '@angular/core';
import { Carpool } from '../model/carpool';
import { CpdataService } from '../shared/cpdata.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-carpool',
  templateUrl: './carpool.component.html',
  styleUrls: ['./carpool.component.css']
})
export class CarpoolComponent implements OnInit {
  // @Input() element: {driver: string, passengers: string[], startTime: string, totalSeats: number};
  // @Input() driver: string;
  @Input() carpoolObj: Carpool;
  // = {
  //   id: '',
  //   driver: '',
  //   passengers: [],
  //   startTime: '',
  //   totalSeats: 0
  // }
  carFull = false;

  constructor(private cpdataService: CpdataService) { }

  ngOnInit(): void {
  }

  onJoinCarpool() {
    this.carpoolObj.passengers.push("User");
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

  // getRemainingSeats() {
  //   return (this.element.totalSeats - this.element.passengers.length);
  // }

  

}
