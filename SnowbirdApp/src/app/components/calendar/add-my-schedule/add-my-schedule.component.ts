import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { User } from 'src/app/model/user';
import { Employee } from 'src/app/model/employee';
import { DailySchedule } from 'src/app/model/dailySchedule';

import { GudataService } from 'src/app/shared/gudata.service';
import { UdataService } from 'src/app/shared/udata.service';
import { ScheduleService } from 'src/app/shared/schedule.service';
import { TransferService } from 'src/app/shared/transfer.service';

@Component({
  selector: 'app-add-my-schedule',
  templateUrl: './add-my-schedule.component.html',
  styleUrls: ['./add-my-schedule.component.css']
})
export class AddMyScheduleComponent implements OnInit {

  @Output() updated = new EventEmitter<{updated: boolean}>();
  @Output() canceled = new EventEmitter<{canceled: boolean}>();

  user: User;
  checkedDays: number[] = [];

  date: Date;
  week: Date[];
  datesString: string[] = [];

  selectedPosition: string;

  constructor(private gudataService: GudataService,
              private udataService: UdataService,
              private scheduleService: ScheduleService,
              private transferService: TransferService) { }

  ngOnInit(): void {
    this.gudataService.checkAccountStatus();
    this.udataService.checkLoginStatus().then(res => {
      this.user = this.udataService.user;

      this.date = new Date(); 
      this.date.setHours(0,0,0,0);
      this.week = this.getWeek(this.date);
      this.datesString = this.getDatesString(this.week);
    });
  }

  getWeek(date: Date) {
    var result = [];
    for (var i = 0; i < 7; i++) {
      var newDay = new Date(date);
      newDay.setDate(date.getDate() + i);
      result.push(newDay);
    }
    return result;
  }

  getDatesString(dates: Date[]){
    var result = [];
    for (var i = 0; i < 7; i++) {
      result.push(this.formatDate(dates[i]));
    }
    return result;
  }

  formatDate(date: Date){
    var str = date.toString().split(" ");
    return str[0] + " " + str[1] + " " + str[2] + ", " + str[3];
  }

  dateChange(event, day){
    if (event.target.checked){
      this.checkedDays.push(day);
    }else{
      const index = this.checkedDays.indexOf(day, 0);
      if (index > -1) {
        this.checkedDays.splice(index, 1);
      }
    }
  }

  onCancel(){
    this.canceled.emit({canceled: true});
  }

  async onSaveSchedule(){
    var picked: boolean[] = [];
    for (var i = 0; i < 7; i++) {
      if (this.checkedDays.includes(i)){
        picked[i] = true;
      }else{
        picked[i] = false;
      }
    }
    var e: Employee = {
      uid: this.user.uid,
      nameDisplayed: this.user.name,
      position: this.selectedPosition,
      photoURL: this.user.photoURL
    };
    await this.scheduleService.updateMySchedule(this.date, picked, e).then(res => {
      this.updated.emit({updated: true});
    });
  }
}
