import { Component, OnInit, Input } from '@angular/core';
import { DailySchedule } from 'src/app/model/dailySchedule';
import { Employee } from 'src/app/model/employee';
import { User } from 'src/app/model/user';

import { UdataService } from 'src/app/shared/udata.service';
import { TransferService } from 'src/app/shared/transfer.service';
import { ScheduleService } from 'src/app/shared/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

export class ScheduleComponent implements OnInit {

  @Input() dsObj: DailySchedule;

  notAdmin: boolean = true;
  isEditing: boolean = false;
  positions = ["Nurse", "Athletic Trainer", "EMT", "Rad Tech", "Front Desk", "Attending", "Resident", "Fellow"];
  enterANewName: boolean = false;
  positionSelected: string = "";
  userSelected: string = "";

  employees: Employee[];
  users: User[] = [];
  usernames: string[] = [];
  
  constructor(private udataService: UdataService,
              private transferService: TransferService,
              private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    this.employees = this.dsObj.attenders;

    this.udataService.getAllUsers().then(res => {
      this.users = this.transferService.getData();
      this.transferService.clearData();
      this.users.forEach(u => {
        this.usernames.push(u.name);
      });
      this.usernames.sort();
      this.usernames.push("Other");
      this.notAdmin = (this.udataService.user.type != 0);
    });
  }

  formatDate(date: Date){
    var str = date.toString().split(" ");
    return str[0] + " " + str[1] + " " + str[2] + " " + str[3];
  }

  onEdit(){
    this.isEditing = true;
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

  onPositionSelected(value: string){
    this.positionSelected = value;
  }

  onUserSelected(value: string){
    this.userSelected = value;
    if (value == "Other") {
      this.enterANewName = true;
    }
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

  onCancel(){
    this.isEditing = false;
  }

  onSaveSchedule(){
    if (window.confirm('Save this schedule? The data will be overwritten.')) {
      this.saveSchedule();
    }
  }

  async saveSchedule(){
    this.dsObj.attenders = this.employees;
    var title = this.makeDocTitle(this.dsObj.date);
    // save to db
    await this.scheduleService.addSchedule(this.dsObj, title).then(res => {
      this.isEditing = false;
    })
  }

  makeDocTitle(date: Date) {
    var title = date.getFullYear().toString() + "-"
              + (date.getMonth() + 1).toString() + "-"
              + date.getDate().toString();
    return title;
  }
}
