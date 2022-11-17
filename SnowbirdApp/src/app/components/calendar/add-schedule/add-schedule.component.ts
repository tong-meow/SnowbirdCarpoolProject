import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

import { User } from 'src/app/model/user';
import { UdataService } from 'src/app/shared/udata.service';
import { TransferService } from 'src/app/shared/transfer.service';
import { ScheduleService } from 'src/app/shared/schedule.service';
import { Employee } from 'src/app/model/employee';
import { DailySchedule } from 'src/app/model/dailySchedule';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.css']
})

export class AddScheduleComponent implements OnInit {

  @Output() added = new EventEmitter<{ds: DailySchedule}>();
  @Output() canceled = new EventEmitter<{canceled: boolean}>();

  date: Date;
  today: string;
  dateWithPipe: string;
  pipe = new DatePipe('en-US');
  formGroup = new FormGroup({ releasedAt: new FormControl()});

  employees: Employee[] = [];
  users: User[] = [];
  usernames: string[] = [];

  positions = ["Nurse", "Athletic Trainer", "EMT", "Rad Tech", "Front Desk", "Attending", "Resident", "Fellow"];
  enterANewName: boolean = false;
  positionSelected: string = "";
  userSelected: string = "";

  constructor(private udataService: UdataService,
              private scheduleService: ScheduleService,
              private transferService: TransferService) { }

  ngOnInit(): void {
    this.setTime();

    this.udataService.getAllUsers().then(res => {
      this.users = this.transferService.getData();
      this.transferService.clearData();
      this.users.forEach(u => {
        this.usernames.push(u.name);
      });
      this.usernames.sort();
      this.usernames.push("Other");
    });
  }

  setTime(){
    this.date = new Date(); 
    this.date.setHours(0,0,0,0);
    this.dateWithPipe = this.pipe.transform(this.date, 'M/d/yy');
    this.today = this.dateWithPipe;
  }

  async onDateSelected(dateSelected) {
    // console.log(date)
    // console.log(typeof(date))
    this.date = dateSelected;
    console.log("New date selected: " + this.date);
  }

  onCancel(){
    this.canceled.emit({canceled: true});
  }

  addEmployee(name: HTMLInputElement, positionOptions: HTMLSelectElement, userOptions: HTMLSelectElement){
    if (this.positionSelected == "" || this.positionSelected == "Select a position"){
      alert("Please select a position!");
      return;
    }
    if (this.userSelected == "" || this.userSelected == "Select a user") {
      alert("Please select an employee!");
      return;
    }
    if (this.userSelected == "Other" && name.value == "") {
      alert("Please enter an employee's name!");
      return;
    }
    // if user is selected
    if (this.userSelected != "" && this.userSelected != "Select a user" && this.userSelected != "Other"){
      //find the user in users
      var e : Employee = {
        uid: "",
        nameDisplayed: this.userSelected,
        position: this.positionSelected,
        photoURL: ""
      };
      this.users.forEach(u => {
        if (u.name == this.userSelected) {
          e.uid = u.uid;
          e.photoURL = u.photoURL;
        }
      });
      this.employees.push(e);
    }
    // if user is input
    else {
      var e: Employee = {
        uid: "",
        nameDisplayed: name.value,
        position: this.positionSelected,
        photoURL: ""
      };
      this.employees.push(e);
    }
    // clear the form
    this.enterANewName = false;
    this.positionSelected = "Select a position";
    this.userSelected = "Select a user";
    positionOptions.value = "Select a position";
    userOptions.value = "Select a user";
  }

  onPositionSelected(value: string){
    this.positionSelected = value;
  }

  onUserSelected(value: string){
    this.userSelected = value;
    if (value == "Other") {
      this.enterANewName = true;
    }
  }

  getPhoto(e: Employee){
    if (e.photoURL != "") {
      return e.photoURL;
    }
    else {
      return "../../../../assets/avatar.png";
    }
  }

  onDeleteUser(e: Employee){
    const index = this.employees.indexOf(e, 0);
    if (index > -1){
      this.employees.splice(index, 1);
    }
  }

  onSaveSchedule(){
    this.scheduleService.getScheduleByDate(this.date).then(res => {
      var schedule = this.transferService.getData();
      this.transferService.clearData();
      if (schedule != undefined) {
        if (window.confirm('A schedule of the selected date already exists. Do you want to overwrite it?')) {
          this.saveSchedule();
        }
      }
      else{
        this.saveSchedule();
      }
    });
  }

  async saveSchedule(){
    var ds: DailySchedule = {
      date: this.date,
      attenders: this.employees
    };
    var title = this.makeDocTitle(this.date);
    // save to db
    await this.scheduleService.addSchedule(ds, title).then(res => {
      this.added.emit({ds: ds});
      this.employees = [];
      this.setTime();
    });
  }

  makeDocTitle(date: Date) {
    var title = date.getFullYear().toString() + "-"
              + (date.getMonth() + 1).toString() + "-"
              + date.getDate().toString();
    return title;
  }
}
