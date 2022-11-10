import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Carpool } from '../../model/carpool';
import { CpdataService } from 'src/app/shared/cpdata.service';
import { ActivatedRoute, Router } from "@angular/router";
import { UdataService } from 'src/app/shared/udata.service';
import { GudataService } from 'src/app/shared/gudata.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Platform } from '@angular/cdk/platform';
import { User } from 'src/app/model/user';
import { Vehicle } from 'src/app/model/vehicle';
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

  carpoolId: string;
  carpoolObj: Carpool = new Carpool("", "", [], 
                                    undefined, "", "", "", 
                                    undefined, undefined, false);

  driver: User = undefined;
  isDriver: boolean = false;
  driverName: string = undefined;
  driverAddress: string = undefined;
  snowbirdAddress = "9385 Snowbird Center Dr, Sandy, UT 84092";

  vehicle: Vehicle = new Vehicle("", "", "", "", "", undefined);

  passengerObjs: User[] = [];
  addresses: string[] = [];
  
  dateStr: string; 
  dateWithPipe: string;
  pipe = new DatePipe('en-US');

  constructor(private route: ActivatedRoute, 
              private udataService: UdataService,
              private gudataService: GudataService,
              private cpdataService: CpdataService,
              private transferService: TransferService,
              private platform: Platform,
              private router: Router
              ){}


  ngOnInit(): void {
      this.gudataService.checkAccountStatus();
      this.udataService.checkLoginStatus();

      this.carpoolId = this.route.snapshot.paramMap.get('id');
      this.cpdataService.getCarpoolWithId(this.carpoolId).then((data) => {
        // console.log('1st then');
        this.carpoolObj = data;
        this.processDate();
        this.vehicle = this.carpoolObj.vehicle;
        this.getPassengerObjs(this.carpoolObj.passengers).then(() => {
          // console.log('2nd then');
          this.udataService.getUser(this.carpoolObj.driver).then(() => {
            this.driver = this.transferService.getData();
            this.transferService.clearData();
            if (this.driver.uid == this.udataService.user.uid){
              this.isDriver = true;
            }
            this.driverName = this.driver.name;
            this.driverAddress = this.driver.address;
            if (this.carpoolObj.direction == "To Snowbird"){
              this.addresses.unshift(this.driverAddress);
              this.addresses.push(this.snowbirdAddress);
            }
            else {
              this.addresses.unshift(this.snowbirdAddress);
              this.addresses.push(this.driverAddress);
            }
          });
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  processDate(){
    var date = this.carpoolObj.date.toString().split(" ");
    this.dateStr = date[0] + " " + date[1] + " " + date[2] + " " + date[3];
  }

  async getPassengerObjs(passengerIds) {
    for (var pas of passengerIds) {
      await this.udataService.getUser(pas)
        .then(() => {
          // console.log(this.passengerObjs)
          var tempPas = this.transferService.getData();
          this.passengerObjs.push(tempPas);
          this.addresses.push(tempPas.address);
          this.transferService.clearData();
        })
        .catch(error => {
          console.log(error);
        });
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
      return (this.carpoolObj.totalSeats - this.carpoolObj.passengers.length);
  }

  onShowRoute() {
      if (this.platform.IOS) {
        if (this.carpoolObj.direction == "To Snowbird"){
          var origin = this.driverAddress;
          var dest = this.snowbirdAddress;
        }
        else {
          var origin = this.snowbirdAddress;
          var dest = this.driverAddress;
        }
        // console.log(origin + "\n" + dest);
        var uri = 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(origin) 
                    // + "&waypoints=" + encodeURIComponent(this.addresses.slice(1,-1).join("|"))
                    + "&waypoints=" + encodeURIComponent(this.groupWaypoints(this.addresses))
                    + "&destination=" + encodeURIComponent(dest) 
                    + "&travelmode=driving"
        // console.log(this.addresses)
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
          // console.log(origin + "\n" + dest)
          var uri = 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(origin) 
                      // + "&waypoints=" + encodeURIComponent(this.addresses.slice(1,-1).join("|"))
                      + "&waypoints=" + encodeURIComponent(this.groupWaypoints(this.addresses))
                      + "&destination=" + encodeURIComponent(dest) 
                      + "&travelmode=driving"
          // console.log(this.addresses)
          // console.log("***** URI *****" + uri)
          window.open(uri)
      }
  }

  navBack(){
    this.router.navigate(['carpools']);
  }

  getPhoto(url: string){
    if (url == undefined || url == "") {
        return "../../../../assets/avatar.png";
    }
    else {
        return url;
    }
  }

  getPhotoInRoute(add: string){
    if (add == this.snowbirdAddress) {
      return "../../../../assets/logo-snowbird.png";
    }
    else if (add == this.driverAddress){
      return this.driver.photoURL;
    }
    else {
      var user: User;
      for (var i = 0; i < this.passengerObjs.length; i++){
        if (add == this.passengerObjs[i].address) {
          return this.passengerObjs[i].photoURL;
        }
      }
      return "../../../../assets/avatar.png";
    }
  }

  groupWaypoints(addresses): string {
      var waypointStrings = addresses.slice(1,-1)
      // console.log(waypointStrings)
      var waypointStr = waypointStrings.join("|")
      // console.log(waypointStr)
      return waypointStr
  }

  onTheWay(){
    window.alert("You started the carpool!");
    this.cpdataService.updateCarpoolStatus(this.carpoolId, true).then(res =>{
      window.location.reload();
    });
  }

  pause(){
    if (window.confirm("Do you want to pause this carpool? The data will not lost.")){
      this.cpdataService.updateCarpoolStatus(this.carpoolId, false).then(res => {
        window.location.reload();
      });
    }
  }
}