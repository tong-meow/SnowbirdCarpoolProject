import { Component, OnInit } from '@angular/core';
// models
import { DailySchedule } from 'src/app/model/dailySchedule';
import { User } from 'src/app/model/user';
// services
import { ScheduleService } from 'src/app/shared/schedule.service';
import { TransferService } from 'src/app/shared/transfer.service';
import { UdataService } from 'src/app/shared/udata.service';
import { GudataService } from 'src/app/shared/gudata.service';
import { CpdataService } from 'src/app/shared/cpdata.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  weeklySchedule: DailySchedule[];

  constructor(private scheduleService: ScheduleService,
              private transferService: TransferService,
              private udataService: UdataService,
              private gudataService: GudataService,
              private cpdataService: CpdataService) { }

  ngOnInit(): void {

    this.gudataService.checkAccountStatus();
    this.udataService.checkLoginStatus();

    var start = new Date();
    start.setDate(start.getDate() - 1);
    var end = new Date(start);
    end.setDate(start.getDate() + 7);
    // var start = new Date("2021-11-20");
    // var end = new Date("2021-11-26");

    // fetch 1 week's schedule data from db
    this.scheduleService.getScheduleByTimePeriod(start, end).then(res => {
      this.weeklySchedule = this.transferService.getData();
      this.transferService.clearData();
      // this.weeklySchedule.forEach(ds => {
      //   console.log(ds);
      // });
    });
  }

  formatDate(date: Date){
    var str = date.toString().split(" ");
    return str[0] + " " + str[1] + " " + str[2] + " " + str[3];
  }
}
