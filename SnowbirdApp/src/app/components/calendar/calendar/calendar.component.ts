import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
// models
import { DailySchedule } from 'src/app/model/dailySchedule';
// services
import { ScheduleService } from 'src/app/shared/schedule.service';
import { TransferService } from 'src/app/shared/transfer.service';
import { UdataService } from 'src/app/shared/udata.service';
import { GudataService } from 'src/app/shared/gudata.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  formGroup = new FormGroup({ releasedAt: new FormControl()});
  weeklySchedule: DailySchedule[];

  date: Date;
  today: string;
  dateWithPipe: string;
  pipe = new DatePipe('en-US');

  onUploading: boolean = false;

  constructor(private scheduleService: ScheduleService,
              private transferService: TransferService,
              private udataService: UdataService,
              private gudataService: GudataService) { }

  ngOnInit(): void {

    this.gudataService.checkAccountStatus();
    this.udataService.checkLoginStatus();

    this.date = new Date(); 
    this.date.setHours(0,0,0,0);
    this.dateWithPipe = this.pipe.transform(this.date, 'M/d/yy');
    this.today = this.dateWithPipe;

    this.getDataForAWeek(this.date);
  }

  async getDataForAWeek(date: Date){
    var start = date;
    var end = new Date(start);
    end.setDate(start.getDate() + 6);
    await this.scheduleService.getScheduleByTimePeriod(start, end).then(res => {
      this.weeklySchedule = this.transferService.getData();
      this.transferService.clearData();
    });
  }

  formatDate(date: Date){
    var str = date.toString().split(" ");
    return str[0] + " " + str[1] + " " + str[2] + " " + str[3];
  }

  async onDateSelected(dateSelected) {
    this.date = dateSelected;
    await this.getDataForAWeek(this.date);
  }

  startUpload(){
    this.onUploading = true;
  }

  stopUpload(){
    this.onUploading = false;
  }
}
