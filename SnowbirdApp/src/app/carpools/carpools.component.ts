import { Component, OnInit } from '@angular/core';
import { CpdataService } from 'src/app/shared/cpdata.service';
import { Carpool } from '../model/carpool';


@Component({
  selector: 'app-carpools',
  templateUrl: './carpools.component.html',
  styleUrls: ['./carpools.component.css']
})
export class CarpoolsComponent implements OnInit {
  // carpools = [];
  carpools: Carpool[] = []; 
  noCarpoolsToday: Boolean = true;
  // carpoolObj: Carpool = {
  //   id: '',
  //   driver: '',
  //   passengers: [],
  //   startTime: '',
  //   totalSeats: 0
  // }

  constructor(private cpdataService: CpdataService) { }

  ngOnInit(): void {
    this.getAllCarpools();
    if (this.carpools.length > 0) {
      this.noCarpoolsToday = false;
    }
  }

  getAllCarpools() {
    // this.cpdataService.getAllCarpools().subscribe(res => {
    //   this.carpools = res.map((e: any) => {
    //     const data = e.payload.doc.data();
    //     data.id = e.payload.doc.id;
    //     return data;
    //   })
    // }, err => {
    //   alert('Error: Cannot fetch carpool data');
    // })
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

  deleteCarpool(carpool: Carpool) {
    if (window.confirm('Are you sure you want to delete this carpool?')) {
      this.cpdataService.deleteCarpool(carpool);
    }
  }

  // onCarpoolAdded(data: {driver: string, passengers: string[], startTime: string, totalSeats: number}) {
  //   this.carpools.push({
  //     driver: data.driver,
  //     passengers: data.passengers,
  //     startTime: data.startTime,
  //     totalSeats: data.totalSeats
  //   });
  // }

  onCarpoolAdded() {
    // this.carpools.push(carpool);
    this.getAllCarpools();
  }
  
}
