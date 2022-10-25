import { Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { UdataService } from 'src/app/shared/udata.service';
import { Carpool } from '../../model/carpool';
import { CpdataService } from '../../shared/cpdata.service';
// import { getAuth, User } from 'firebase/auth';
// import { User } from '../model/user';

@Component({
  selector: 'app-addcarpool',
  templateUrl: './addcarpool.component.html',
  styleUrls: ['./addcarpool.component.css']
})
export class AddcarpoolComponent implements OnInit {
  // @Output() newCarpool = new EventEmitter<{driver: string, passengers: string[], startTime: string, totalSeats: number}>();
  @Output() newCarpool = new EventEmitter<{date:Date}>();
  @Input() date: Date; // from parent - carpools list
  selectedDirection: string;
  carpoolObj: Carpool = {
    id: '',
    driver: '',
    passengers: [],
    date: new Date(),
    startTime: '',
    arrivalTime: '',
    direction: '',
    totalSeats: 0
  }

  // fallback = null;
  // // Provide empty object fallback
  // carpoolObj = this.fallback || {}; // '||' returns the value to the right if the value to the left is falsy

  constructor(private cpdataService: CpdataService,
              private udataService: UdataService) { }

  ngOnInit(): void {
  }

  // this version is for 2way data binding with [ngModel]
  // resetForm() {
  //   this.id = '';
  //   this.driver = '';
  //   this.passengers = [];
  //   this.startTime = '';
  //   this.totalSeats = 0;
  // }


  async onCreateCarpool(startTimeInput:HTMLInputElement, arrivalTimeInput:HTMLInputElement, seatsInput:HTMLInputElement) {
    if (startTimeInput.value == '' || startTimeInput.value == ''|| seatsInput.value == '' || !this.selectedDirection.includes("Snowbird")) {
      alert('Please fill in all fields.');
      return;
    }
    else {
      this.carpoolObj.id = '';
      this.carpoolObj.driver = this.udataService.user.uid;
      // this.driverName = this.udataService.getUser(this.carpoolObj.driver)
      // this.carpoolObj.passengers = [];
      this.carpoolObj.date = this.date;
      // this.carpoolObj.startTime = new Date();
      this.carpoolObj.startTime = startTimeInput.value;
      this.carpoolObj.arrivalTime = arrivalTimeInput.value;
      this.carpoolObj.direction = this.selectedDirection; 
      this.carpoolObj.totalSeats = Number(seatsInput.value);

      await this.cpdataService.addCarpool(this.carpoolObj)
        .then(() => {
          // Emit event to notify carpools parent component to show carpools for date
            this.newCarpool.emit({date: this.date});
        })
        .catch(errorHandler)
      
      // Reset the form
      arrivalTimeInput.value = '';
      startTimeInput.value = '';
      seatsInput.value = '';
      this.selectedDirection = '';
    }
  }
}

function errorHandler(errorHandler: any) {
  throw new Error('[ADDCARPOOL] Carpool cannot be added.');
}