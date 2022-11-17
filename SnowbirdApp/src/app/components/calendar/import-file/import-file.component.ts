import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

  @Output() canceled = new EventEmitter<{canceled: boolean}>();

  event: any;
  // uploadPressed: boolean = false;
  allData: AOA[] = [];
  // data: AOA = [];

  allSchedules: DailySchedule[];

  weekMap = new Map<number, string>([[2, "Saturday"], [4, "Sunday"], [6, "Monday"],[8, "Tuesday"], [10, "Wednesday"], [12, "Thursday"], [14, "Friday"]]);
  
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

async readFile(event: any){
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
        this.allData[i] = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
        // console.log("Got data from sheet #" + i);
        // console.log(this.data);
        var positionMap = this.getPositionMap(this.allData[i]);

        this.processData(this.allData[i], positionMap);
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  getPositionMap(data: AOA) {
    var map = new Map<number, string>()
    for (var row = 3; row < data.length; row++) {
      if (data[row][0] == undefined) continue;
      map.set(row, data[row][0]);
    }
    return map;
  }

  // process 1 sheet (7 days)
  async processData(data: AOA, positionMap: Map<number, string>){
    // foreach column (one single day)
    for (var col = 2; col < data[0].length; col+=2) {

      // date
      var excelDate = data[1][col];
      if (excelDate == undefined) continue;
      var tsDate: Date;
      if (typeof(excelDate) == "string") {
        tsDate = this.stringDateToJSDate(excelDate);
      }
      else {
        tsDate = this.excelDateToJSDate(excelDate);
      }

      // employees
      var attenders: Employee[] = [];
      for (var row = 3; row < data.length; row++) {
        var nameData = data[row][col];
        if (nameData == undefined) continue;
        if (nameData.includes("/")){
          var names = nameData.split("/");
          names.forEach(n => {
            var e = this.processEmployeeInfo(n, positionMap.get(row));
            attenders.push(e);
          });
        }
        else if (nameData.includes("&")){
          var names = nameData.split(" & ");
          names.forEach(n => {
            var e = this.processEmployeeInfo(n, positionMap.get(row));
            attenders.push(e);
          });
        }
        else if (nameData.includes("'o'")){
          var names = nameData.split(" 'o' ");
          names.forEach(n => {
            var e = this.processEmployeeInfo(n, positionMap.get(row));
            attenders.push(e);
          });
        }
        else {
          var e = this.processEmployeeInfo(nameData, positionMap.get(row));
          attenders.push(e);
        }
      }

      var docTitle = this.makeDocTitle(tsDate);

      await this.processAttenders(attenders).then(res => {
        var ds: DailySchedule = {
          date: tsDate,
          attenders: attenders
        };
        // save to db
        this.scheduleService.addSchedule(ds, docTitle);
      });
    }
  }

  makeDocTitle(date: Date) {
    var title = date.getFullYear().toString() + "-"
              + (date.getMonth() + 1).toString() + "-"
              + date.getDate().toString();
    return title;
  }

  excelDateToJSDate(date) {
    var tsDate = new Date(Math.round((date - 25568.70833) * 86400 * 1000));
    return new Date(tsDate.getFullYear(),
                    tsDate.getMonth(),
                    tsDate.getDate());
  }

  stringDateToJSDate(date) {
    // 2/19/2022- TNCC
    var strArray = date.split("-");
    var dateStr = strArray[0].split("/");
    var d = dateStr[2]+"-"+dateStr[0]+"-"+dateStr[1];
    return new Date(d);
  }

  processEmployeeInfo(name: string, position: string){
    var e: Employee = {
      uid: "",
      nameDisplayed: name,
      position: position,
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

  onCancel(){
    this.canceled.emit({canceled: true});
  }
}
