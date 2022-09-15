import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "SnowbirdApp";
  // carpools = [{driver: 'Joanne', passengers: ['Tong', 'Ann'], startTime: '08:00', totalSeats: 4}];
  carpools = [];
  
  onCarpoolAdded(data: {driver: string, passengers: string[], startTime: string, totalSeats: number}) {
    this.carpools.push({
      driver: data.driver,
      passengers: data.passengers,
      startTime: data.startTime,
      totalSeats: data.totalSeats
    });
  }

}
