import { Component, OnInit, Input, Output } from '@angular/core';
import { Carpool } from '../model/carpool';
import { CpdataService } from '../shared/cpdata.service';

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
    if (this.carpoolObj.passengers.length == this.carpoolObj.totalSeats) {
      this.carFull = true;
    }
    this.cpdataService.updateCarpool(this.carpoolObj);
  }

  // onJoinCarpool() {
  //   this.element.passengers.push("User");
  //   if (this.element.passengers.length == this.element.totalSeats) {
  //     this.carFull = true;
  //   }
  // }

  getRemainingSeats() {
    return (this.carpoolObj.totalSeats - this.carpoolObj.passengers.length);
  }

  // getRemainingSeats() {
  //   return (this.element.totalSeats - this.element.passengers.length);
  // }

  

}
