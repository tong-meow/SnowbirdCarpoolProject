import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import { UdataService } from 'src/app/shared/udata.service';
import { TransferService } from 'src/app/shared/transfer.service';
import { ScheduleService } from 'src/app/shared/schedule.service';

import { DailySchedule } from 'src/app/model/dailySchedule';
import { Employee } from 'src/app/model/employee';

type AOA = any[][];

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.css']
})

export class ImportFileComponent implements OnInit {

  event: any;
  // uploadPressed: boolean = false;
  data: AOA = [];

  weekMap = new Map<number, string>([[2, "Saturday"], [4, "Sunday"], [6, "Monday"],[8, "Tuesday"], [10, "Wednesday"], [12, "Thursday"], [14, "Friday"]]);
  positionMap = new Map<number, string>([[3, "Nurse"], [5, "Athletic Trainer"], [6, "EMT"], [8, "Rad Tech"], [10, "Front Desk"], [12, "Attending"], [13, "Resident"], [14, "Fellow"]]);
  
  constructor(private udataService: UdataService,
              private transferService: TransferService,
              private scheduleService: ScheduleService) { }

  ngOnInit(): void {
  }

  onUpload(){
    this.readFile(this.event);
  }

  onFileChange(event: any){
    this.event = event;
  }

readFile(event: any){
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      for(var i = 0; i < wb.SheetNames.length; i++){
        const wsname: string = wb.SheetNames[i];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* save data */
        this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
        console.log("Got data from sheet #" + i);
        // console.log(this.data);
        this.processData(this.data);
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // process 1 sheet (7 days)
  async processData(data: AOA){
    // foreach column (one single day)
    for (var col = 2; col < data[0].length; col+=2) {

      // date
      var excelDate = data[1][col];
      if (excelDate == undefined) continue;
      var tsDate = this.excelDateToJSDate(excelDate);
      // console.log(tsDate);

      // employees
      var attenders: Employee[] = [];
      for (var row = 3; row < data.length; row++) {
        var nameData = data[row][col];
        if (nameData == undefined) continue;
        if (nameData.includes("/")){
          var names = nameData.split("/");
          names.forEach(n => {
            var e = this.processEmployeeInfo(n, row);
            attenders.push(e);
          });
        }
        else if (nameData.includes("&")){
          var names = nameData.split(" & ");
          names.forEach(n => {
            var e = this.processEmployeeInfo(n, row);
            attenders.push(e);
          });
        }
        else if (nameData.includes("'o'")){
          var names = nameData.split(" 'o' ");
          names.forEach(n => {
            var e = this.processEmployeeInfo(n, row);
            attenders.push(e);
          });
        }
        else {
          var e = this.processEmployeeInfo(nameData, row);
          attenders.push(e);
        }
      }

      await this.processAttenders(attenders).then(res => {
        var ds: DailySchedule = {
          date: tsDate,
          attenders: attenders
        };
        // save to db
        this.scheduleService.addSchedule(ds);
      });
    }
  }

  excelDateToJSDate(date) {
    return new Date(Math.round((date - 25568.70833) * 86400 * 1000));
  }

  processEmployeeInfo(name: string, row: number){
    var e: Employee = {
      uid: "",
      nameDisplayed: name,
      position: this.positionMap.get(row),
      photoURL: ""
    };
    return e;
  }

  async processAttenders(attenders: Employee[]) {
    for(var i = 0; i < attenders.length; i++) {
      await this.udataService.getUidAndPhotoByName(attenders[i].nameDisplayed).then(res => {
        var obj = this.transferService.getData();
        if (obj != undefined) {
          attenders[i].uid = obj.uid;
          attenders[i].photoURL = obj.photoURL;
        }
        this.transferService.clearData();
      })
      .catch(error => {
        console.log(error);
      })
    }
  }
}
