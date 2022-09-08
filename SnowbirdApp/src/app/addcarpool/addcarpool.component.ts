import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { Carpool } from '../model/carpool';
import { CpdataService } from '../shared/cpdata.service';

@Component({
  selector: 'app-addcarpool',
  templateUrl: './addcarpool.component.html',
  styleUrls: ['./addcarpool.component.css']
})
export class AddcarpoolComponent implements OnInit {
  // @Output() newCarpool = new EventEmitter<{driver: string, passengers: string[], startTime: string, totalSeats: number}>();
  @Output() newCarpool = new EventEmitter<{}>();
  // carpoolCreated = false;
  // totalSeats = 4;
  // carpools = [];
  carpoolObj: Carpool = {
    id: '',
    driver: '',
    passengers: [],
    startTime: '',
    totalSeats: 0
  }
  // id: string = '';
  // driver: string = '';
  // passengers: string[] = [];
  // startTime: string = '';
  // totalSeats: number = 0;

  constructor(private cpdataService: CpdataService) { }

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


  onCreateCarpool(nameInput:HTMLInputElement, timeInput:HTMLInputElement, seatsInput:HTMLInputElement) {
    if (nameInput.value == '' || timeInput.value == '' || seatsInput.value == '') {
      alert('Please fill in all fields.');
      return;
    }

    // this.carpoolCreated = true;
    this.carpoolObj.id = '';
    this.carpoolObj.driver = nameInput.value;
    this.carpoolObj.passengers = [];
    this.carpoolObj.startTime = timeInput.value;
    this.carpoolObj.totalSeats = Number(seatsInput.value);

    this.cpdataService.addCarpool(this.carpoolObj);
    
    // Emit event to notify carpools parent component
    this.newCarpool.emit();
    // this.newCarpool.emit({
    //   driver: nameInput.value,
    //   passengers: [],
    //   startTime: timeInput.value,
    //   totalSeats: Number(seatsInput.value)
    // });

    // Reset the form
    nameInput.value == '';
    // this.resetForm();
  }



}
