import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.css']
})
export class EditVehicleComponent implements OnInit {

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  makeText: string = "";
  modelText: string = "";
  licenseText: string = "";
  seatsAvailText: string = "";

  constructor(private gudataService: GudataService,
              private udataService: UdataService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onSaveCar(make: HTMLInputElement, model: HTMLInputElement, 
            license: HTMLInputElement, seats: HTMLInputElement){
    if (license.value == '' || seats.value == '') {
      alert('Please fill in the car license and number of seats available.');
      return;
    }
    
  }
}
