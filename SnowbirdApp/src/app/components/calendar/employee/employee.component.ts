import { Component, OnInit, Input } from '@angular/core';
// models
import { Employee } from 'src/app/model/employee';
import { Carpool } from 'src/app/model/carpool';
// services
import { CpdataService } from 'src/app/shared/cpdata.service';
import { UdataService } from 'src/app/shared/udata.service';
import { TransferService } from 'src/app/shared/transfer.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {

  @Input() employeeObj: Employee;
  @Input() date: Date;

  // 0: not in any carpool
  // 1: driver
  // 2: passenger
  status: number = 0;

  constructor(private cpdataService: CpdataService,
              private udataService: UdataService,
              private transferService: TransferService) { }

  ngOnInit(): void {
    this.checkUserUpdate().then(res => {
      var cps: Carpool[] = [];
      this.cpdataService.getAllCarpoolsFromDate(this.date).then(res => {
        /*
            driver: string;
            passengers: string[];
        */
        cps = this.transferService.getData();
        this.transferService.clearData();
        this.findStatus(cps);
      })
      .catch(error => {
        console.log(error);
      });
    });
  }

  async checkUserUpdate(){
    if (this.employeeObj.uid == "") {
      await this.udataService.getUidAndPhotoByName(this.employeeObj.nameDisplayed).then(res =>{
        var result = this.transferService.getData();
        this.transferService.clearData();
        if (result != undefined) {
          this.employeeObj.uid = result.uid;
          this.employeeObj.photoURL = result.photoURL;
          console.log("Updated: " + this.employeeObj.uid);
        }
      });
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

  findStatus(cps: Carpool[]){
    if (cps == undefined || cps.length == 0){
      this.status = 0;
      return;
    }
    
    for (var i = 0; i < cps.length; i++) {
      if (cps[i].driver == this.employeeObj.uid){
        this.status = 1;
        return;
      }
      else {
        for (var j = 0; j < cps[i].passengers.length; j++){
          if (cps[i].passengers[j] == this.employeeObj.uid){
            this.status = 2;
            return;
          }
        }
      }
    }
    this. status = 0;
  }
}
