import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carpool',
  templateUrl: './carpool.component.html',
  styleUrls: ['./carpool.component.css']
})
export class CarpoolComponent implements OnInit {
  startTime = "07:30";
  driver = "Joanne";
  passengers = [];
  totalSeats = 4;
  carFull = false;

  constructor() { }

  ngOnInit(): void {
  }

  onJoinCarpool() {
    this.passengers.push("Ben");
    if (this.passengers.length == this.totalSeats) {
      this.carFull = true;
    }
  }

  getRemainingSeats() {
    return (this.totalSeats - this.passengers.length);
  }

}
