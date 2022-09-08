import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-carpool',
  templateUrl: './carpool.component.html',
  styleUrls: ['./carpool.component.css']
})
export class CarpoolComponent implements OnInit {
  @Input() element: {driver: string, passengers: string[], startTime: string, totalSeats: number};
  @Input() driver: string;
  // newPassenger: string;
  // startTime = "07:30";
  // totalSeats = 4;
  carFull = false;

  constructor() { }

  ngOnInit(): void {
  }


  onJoinCarpool() {
    this.element.passengers.push("User");
    if (this.element.passengers.length == this.element.totalSeats) {
      this.carFull = true;
    }
    
  }

  getRemainingSeats() {
    return (this.element.totalSeats - this.element.passengers.length);
  }

  

}
