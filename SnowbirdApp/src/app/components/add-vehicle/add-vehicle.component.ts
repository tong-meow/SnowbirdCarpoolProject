import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { getFirestore } from "firebase/firestore";
// router
import { Router } from "@angular/router";
// models
import { GoogleAccount } from "../../model/googleAccount";
import { User } from '../../model/user';
import { Vehicle } from 'src/app/model/vehicle';
// services
import { GudataService } from '../../shared/gudata.service';
import { UdataService } from 'src/app/shared/udata.service';
import { VdataService } from 'src/app/shared/vdata.service';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  @Input() uid: String;
  @Output() updatedVehicle = new EventEmitter<{license:String}>();

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  nicknameText: string = "";
  makeText: string = "";
  modelText: string = "";
  licenseText: string = "";
  seatsAvailText: string = "";

  constructor(private gudataService: GudataService,
              private udataService: UdataService,
              private vdataService: VdataService,
              private router: Router) { }

  ngOnInit(): void {
  }

  async onSaveCar(nickname: HTMLInputElement, make: HTMLInputElement, model: HTMLInputElement, 
            license: HTMLInputElement, seats: HTMLInputElement){
    if (license.value == '' || seats.value == '') {
      alert('Please fill in the car license and number of seats available.');
      return;
    }
    var v = {
      uid : this.udataService.user.uid,
      nickname : nickname.value,
      make : make.value.toUpperCase(),
      model : model.value,
      license : license.value.toUpperCase(),
      seatsAvail : Number(seats.value)
    }
    // add to db
    await this.vdataService.addVehicle(v).then(res => {
      // emit to parent: profile component
      this.updatedVehicle.emit({license: license.value});
    })
    .catch(error => {
      console.log(error);
    })
  }

  onCancel(){
    this.updatedVehicle.emit({license: ""});
  }
}
