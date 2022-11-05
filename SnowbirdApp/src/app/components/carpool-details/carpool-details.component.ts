import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Carpool } from '../../model/carpool';
import { CpdataService } from 'src/app/shared/cpdata.service';
import { ActivatedRoute, Router } from "@angular/router";
import { UdataService } from 'src/app/shared/udata.service';
import { GudataService } from 'src/app/shared/gudata.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Platform } from '@angular/cdk/platform';
import { User } from 'src/app/model/user';
import { TransferService } from 'src/app/shared/transfer.service';
import { DatePipe } from '@angular/common';

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
    driver: User = null;
    driverName: string = null;
    driverAddress: string = null;
    snowbirdAddress = "9385 Snowbird Center Dr, Sandy, UT 84092";
    passengerObjs: User[] = [];
    addresses: string[] = [];
    date: string; 
    dateWithPipe: string;
    pipe = new DatePipe('en-US');

    constructor(private router: Router, 
                private route: ActivatedRoute, 
                private udataService: UdataService,
                private gudataService: GudataService,
                private cpdataService: CpdataService,
                private transferService: TransferService,
                private platform: Platform
                ){}


    ngOnInit(): void {
        // if the user hasn't logged in, nav to login page
        // if (this.udataService.user == undefined) {
        //   alert('Please log in first.');
        //   this.router.navigate(['login']);
        //   return;
        // }
        this.gudataService.checkAccountStatus();
        this.udataService.checkLoginStatus();

        this.carpoolId = this.route.snapshot.paramMap.get('id');
        console.log("[CARPOOL DETAILS]")
        this.cpdataService.getCarpoolWithId(this.carpoolId)
            .then((data) => {
              console.log('1st then')
              this.carpoolObj = data
            })
            .then(() => {
              console.log('2nd then')
              // Get Passengers Users array
              this.getPassengerObjs(this.carpoolObj.passengers)
                .then(() => {
                  console.log('3rd then')
                  // Get Driver User
                  this.udataService.getUser(this.carpoolObj.driver)
                    .then((res) => {
                    this.driver = this.transferService.getData();
                    this.driverName = this.driver.name;
                    this.driverAddress = this.driver.address;
                    console.log("Driver: " + this.driverName + " " + this.driverAddress);
                    this.transferService.clearData();
                    })
                    .then((res) => {
                    // Set up addresses
                    this.addresses.unshift(this.driverAddress) // puts address at index 0
                    this.addresses.push(this.snowbirdAddress) // puts address last
                    })
                    .catch(errorHandlerDriver)
                })
            })
            .then(() => {
              this.date = this.pipe.transform(this.carpoolObj.date, 'M/d/yy');
              console.log('[CARPOOLDETAILS: 3rd then')

              // // Get Driver User
              // this.udataService.getUser(this.carpoolObj.driver)
              //   .then((res) => {
              //   this.driver = this.transferService.getData();
              //   this.driverName = this.driver.name;
              //   this.driverAddress = this.driver.address;
              //   console.log("Driver: " + this.driverName + this.driverAddress);
              //   this.transferService.clearData();
              //   })
              //   .then((res) => {
              //   // Set up addresses
              //   this.addresses.unshift(this.driverAddress) // puts address at index 0
              //   this.addresses.push(this.snowbirdAddress) // puts address last
              //   })
              //   .catch(errorHandler3)
            })
            .catch(errorHandler);         
    }

    async getPassengerObjs(passengerIds) {
      for (var pas of passengerIds) {
        await this.udataService.getUser(pas)
          .then(() => {
            console.log(this.passengerObjs)
            console.log("Passenger id: " + pas);
            var tempPas = this.transferService.getData();
            console.log("tempPas variable: " + tempPas)
            
            this.passengerObjs.push(tempPas);
            console.log(this.passengerObjs)
            this.addresses.push(tempPas.address)
            console.log(this.addresses)
            console.log("loading passenger: " + tempPas.name + tempPas.address);
            this.transferService.clearData();
            console.log("cleared transfer service data")
            })
          .catch(errorHandlerPas)
      }
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
          );
        }
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
    
          var origin = this.driverAddress
          var dest = this.snowbirdAddress
          console.log(origin + "\n" + dest)
          var uri = 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(origin) 
                      // + "&waypoints=" + encodeURIComponent(this.addresses.slice(1,-1).join("|"))
                      + "&waypoints=" + encodeURIComponent(this.groupWaypoints(this.addresses))
                      + "&destination=" + encodeURIComponent(dest) 
                      + "&travelmode=driving"
          console.log(this.addresses)
          console.log("***** URI *****" + uri)
          window.open(uri)
        }
        else if (this.platform.ANDROID) {
    
        }
        else if (this.platform.isBrowser) {
            // Request directions and launch Google Maps with results: https://www.google.com/maps/dir/?api=1&parameters
            // Strings should be URL-encoded, "Berlin,Germany|Paris,France" should be converted to waypoints=Berlin%2CGermany%7CParis%2CFrance.
            // var origin = "3839 S West Temple St, Salt Lake City, UT 84115"
            // var dest = "9385 Snowbird Center Dr, Sandy, UT 84092"
            var origin = this.addresses[0]
            var dest = this.addresses[this.addresses.length - 1]
            console.log(origin + "\n" + dest)
            var uri = 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(origin) 
                        // + "&waypoints=" + encodeURIComponent(this.addresses.slice(1,-1).join("|"))
                        + "&waypoints=" + encodeURIComponent(this.groupWaypoints(this.addresses))
                        + "&destination=" + encodeURIComponent(dest) 
                        + "&travelmode=driving"
            console.log(this.addresses)
            console.log("***** URI *****" + uri)
            window.open(uri)
        }
    }
    groupWaypoints(addresses): string {
        var waypointStrings = addresses.slice(1,-1)
        console.log(waypointStrings)
        var waypointStr = waypointStrings.join("|")
        console.log(waypointStr)
        return waypointStr
    }

}



function errorHandler(errorHandler: any) {
    throw new Error('No carpool data found');
}

function errorHandlerPas(errorHandler: any) {
  throw new Error('No pas data found');
}

function errorHandlerDriver(errorHandler: any) {
  throw new Error('No driver data found');
}


