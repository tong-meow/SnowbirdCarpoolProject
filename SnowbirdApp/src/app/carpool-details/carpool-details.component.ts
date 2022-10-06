import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Carpool } from '../model/carpool';
import { CpdataService } from 'src/app/shared/cpdata.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Platform } from '@angular/cdk/platform';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-carpool-details',
  templateUrl: './carpool-details.component.html',
  styleUrls: ['./carpool-details.component.css']
})
export class CarpoolDetailsComponent implements OnInit {
  carpoolObj: Carpool;
  carpoolId: string;
  carFull: Boolean = false;
  
  constructor (
    private router: Router, 
    private route: ActivatedRoute, 
    private cpdataService: CpdataService,
    private platform: Platform
    ) {  }


  ngOnInit(): void {
    this.carpoolId = this.route.snapshot.paramMap.get('id');
    this.cpdataService.getCarpoolWithId(this.carpoolId)
      .then(data => 
        // console.log("in carpool detail component:" + data),
        this.carpoolObj = data)
      .catch(errorHandler);

    console.log("carpoolObj in carpoolDetailComponent: " + this.carpoolObj);
  }


  getRemainingSeats() {
    console.log("no. of passengers: " + this.carpoolObj.passengers.length);
    console.log("no. of seats: " + this.carpoolObj.totalSeats);
  
    if (this.carpoolObj.passengers.length == this.carpoolObj.totalSeats) {
      this.carFull = true;
      console.log("setting bool car is full");
    }
    return (this.carpoolObj.totalSeats - this.carpoolObj.passengers.length);
  }


  onShowRoute() {
    if (this.platform.IOS) {

    }
    else if (this.platform.ANDROID) {

    }
    else if (this.platform.isBrowser) {
      // Request directions and launch Google Maps with results: https://www.google.com/maps/dir/?api=1&parameters
      // Strings should be URL-encoded, "Berlin,Germany|Paris,France" should be converted to waypoints=Berlin%2CGermany%7CParis%2CFrance.
      var origin = "3839 S West Temple St, Salt Lake City, UT 84115"
      var dest = "9385 Snowbird Center Dr, Sandy, UT 84092"
      var uri = 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(origin) + "&destination=" + encodeURIComponent(dest) 
                  + "&travelmode=driving"
      window.open(uri)

    }

  }
  
}


function errorHandler(errorHandler: any) {
  throw new Error('No carpool data found');
}


