import { Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { UdataService } from 'src/app/shared/udata.service';
import { Carpool } from '../../model/carpool';
import { CpdataService } from '../../shared/cpdata.service';
import { ScheduleService } from 'src/app/shared/schedule.service';
import { VdataService } from 'src/app/shared/vdata.service';
import { TransferService } from 'src/app/shared/transfer.service';
import { Vehicle } from 'src/app/model/vehicle';
import { User } from 'src/app/model/user';
// import { getAuth, User } from 'firebase/auth';
// import { User } from '../model/user';

@Component({
  selector: 'app-addcarpool',
  templateUrl: './addcarpool.component.html',
  styleUrls: ['./addcarpool.component.css']
})

export class AddcarpoolComponent implements OnInit {
  // @Output() newCarpool = new EventEmitter<{driver: string, passengers: string[], startTime: string, totalSeats: number}>();
  @Output() newCarpool = new EventEmitter<{date: Date}>();
  @Output() canceled = new EventEmitter<{canceled: boolean}>();
  @Input() date: Date; // from parent - carpools list

  selectedDirection: string;
  selectedVehicle: Vehicle;
  vehicles: Vehicle[] = [];

  carpoolObj: Carpool = {
    id: '',
    driver: '',
    passengers: [],
    date: new Date(),
    startTime: '',
    arrivalTime: '',
    direction: '',
    vehicle: new Vehicle("", "", "", "", "", "", 0),
    totalSeats: 0,
    hasStarted: false
  }

  // fallback = null;
  // // Provide empty object fallback
  // carpoolObj = this.fallback || {}; // '||' returns the value to the right if the value to the left is falsy

  constructor(private cpdataService: CpdataService,
              private udataService: UdataService,
              private transferService: TransferService,
              private vdataService: VdataService) { }

  ngOnInit(): void {

    this.udataService.checkLoginStatus().then(res => {
      this.vdataService.getAllVehicles().then(res => {
        this.vehicles = this.transferService.getData();
        this.transferService.clearData();
      })
      .catch(error => {
        console.log(error);
      });
    })
    .catch(error => {
      console.log(error);
    });

  }

  // this version is for 2way data binding with [ngModel]
  // resetForm() {
  //   this.id = '';
  //   this.driver = '';
  //   this.passengers = [];
  //   this.startTime = '';
  //   this.totalSeats = 0;
  // }

  onOptionsSelected(value: string){
    if (value == "Select a car"){
      this.selectedVehicle = undefined;
    }
    else {
      for(var i = 0; i < this.vehicles.length; i++){
        if (this.vehicles[i].license == value){
          this.selectedVehicle = this.vehicles[i];
        }
      }
    }
  }

  getSeats(license: string){
    for(var i = 0; i < this.vehicles.length; i++) {
      if (this.vehicles[i].license == license){
        return this.vehicles[i].seatsAvail;
      }
    }
  }


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
      if (this.selectedVehicle != undefined) {
        this.selectedVehicle.seatsAvail = Number(seatsInput.value);
        this.carpoolObj.vehicle = this.selectedVehicle;
      }
      else {
        this.carpoolObj.vehicle = this.blankVehicle(Number(seatsInput.value));
      }
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

  blankVehicle(seats: number) {
    var v: Vehicle = {
      license: "",
      uid: "",
      nickname: "",
      make: "",
      model: "",
      color: "",
      seatsAvail: seats
    };
    return v;
  }

  onCancelCreating(){
    this.canceled.emit({canceled: true});
  }
}

function errorHandler(errorHandler: any) {
  throw new Error('[ADDCARPOOL] Carpool cannot be added.');
}