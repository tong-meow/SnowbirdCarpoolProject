import { Component, OnInit, Input, Output, DirectiveDecorator, EventEmitter } from '@angular/core';
import { Carpool } from '../../model/carpool';
import { CpdataService } from '../../shared/cpdata.service';
import { Router } from "@angular/router";
import { UdataService } from 'src/app/shared/udata.service';
import { GudataService } from 'src/app/shared/gudata.service';
import { User } from '../../model/user';
import { TransferService } from 'src/app/shared/transfer.service';
import { VdataService } from 'src/app/shared/vdata.service';
import { Vehicle } from 'src/app/model/vehicle';

@Component({
    selector: 'app-carpool',
    templateUrl: './carpool.component.html',
    styleUrls: ['./carpool.component.css']
})
export class CarpoolComponent implements OnInit {
    // @Input() element: {driver: string, passengers: string[], startTime: string, totalSeats: number};
    @Input() carpoolObj: Carpool;
    @Output() carpoolRemoved = new EventEmitter<{carpoolId: string}>();
    
    driver: User;
    driverName: string = null;
    passengerObjs: User[] = [];
    startTime: number = null;
    carFull = false;
    joinedCar = false;
    isDriver = false;

    constructor(private cpdataService: CpdataService,
                private udataService: UdataService,
                private gudataService: GudataService,
                private transferService: TransferService,
                private vdataService: VdataService,
                private router: Router){}

    ngOnInit(): void {
        // if the user hasn't logged in, nav to login page
        // if (this.udataService.user == undefined) {
        //     alert('Please log in first.');
        //     this.router.navigate(['login']);
        //     return;
        // }
        this.gudataService.checkAccountStatus();
        this.udataService.checkLoginStatus();

        // this.startTime = this.carpoolObj.arrivalTime.getHours()

        // Get Driver User
        this.udataService.getUser(this.carpoolObj.driver)
            .then(() => {
                this.driver = this.transferService.getData();
                console.log("this.driver.name:" + this.driver.name);
                this.driverName = this.driver.name;
                this.transferService.clearData();
                if (this.driver.uid == this.udataService.user.uid) {
                    this.isDriver = true;
                }
             })
             .then(() => {
                // Get Passengers Users array
                console.log("[CARPOOL]: getting passengers")
                this.getPassengerObjs(this.carpoolObj.passengers)
                console.log("[CARPOOL]: Passengers are " + this.passengerObjs)
                // disable Join button if user is already in passengers
                this.carpoolObj.passengers.forEach((pasId, index)=>{
                    if (pasId == this.udataService.user.uid) {
                    this.joinedCar = true;
                    }
                });
             })
            .catch(errorHandler)

    }

    // Add passenger to obj array and add to db
    async onJoinCarpool() {
        // this.carpoolObj.passengers.push(this.udataService.user.uid);
        // await this.cpdataService.updateCarpoolPassengers(this.carpoolObj, this.carpoolObj.passengers);
        this.passengerObjs.push(this.udataService.user);
        this.cpdataService.addCarpoolPassenger(this.carpoolObj.id, this.udataService.user.uid);
        this.joinedCar = true;
    }

    // Remove passenger from obj array and from db
    async onLeaveCarpool() {
        // this.carpoolObj.passengers.forEach((pasId, index)=>{
        //     if (pasId == this.udataService.user.uid) {
        //         this.carpoolObj.passengers.splice(index,1);
        //     }
        // });
        // await this.cpdataService.updateCarpoolPassengers(this.carpoolObj, this.carpoolObj.passengers);
        this.passengerObjs.forEach((pas, index)=>{
            if (pas.uid == this.udataService.user.uid) {
                this.passengerObjs.splice(index,1);
            }
        });
        this.cpdataService.removeCarpoolPassenger(this.carpoolObj, this.udataService.user.uid);
        this.joinedCar = false;
    }

    onCancelCarpool() {
        if (window.confirm('Delete this carpool?')) {
            this.cpdataService.deleteCarpool(this.carpoolObj)
                .then(() => {
                    this.carpoolRemoved.emit({carpoolId: this.carpoolObj.id});
                })
                .catch(errorHandlerCancel)
        }
    }

    getRemainingSeats() {
        // console.log("[CARPOOL]: Getting remaining seats");
        // console.log("no. of passengers in cp: " + this.passengerObjs.length);

        if (this.passengerObjs.length == this.carpoolObj.totalSeats) {
            this.carFull = true;
            // console.log("setting bool car is full");
        }
        return (this.carpoolObj.totalSeats - this.passengerObjs.length);
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
              console.log(this.passengerObjs);
              console.log("loading passenger: " + tempPas.name);
              this.transferService.clearData();
              console.log("cleared transfer service data")
              })
            .catch(errorHandlerPas)
        }
    }
    
    getPhoto(url: string){
        if (url == undefined || url == "") {
            return "../../../../assets/avatar.png";
        }
        else {
            return url;
        }
    }


}

function errorHandler(errorHandler: any) {
    throw new Error('No driver user data found');
}

function errorHandlerPas(errorHandler: any) {
    throw new Error('No passenger user data found');
}

function errorHandlerCancel(errorHandler: any) {
    throw new Error('Carpool cannot be deleted.');
}