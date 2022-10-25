import { Component, OnInit } from '@angular/core';
// router
import { Router } from "@angular/router";
// services
import { GudataService } from '../../shared/gudata.service';
import { UdataService } from 'src/app/shared/udata.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {

  constructor(private gudataService: GudataService,
              private udataService: UdataService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.gudataService.account == undefined) {
      alert('Please log in first.');
      this.router.navigate(['login']);
      return;
    }
    else if (!this.udataService.user == undefined) {
      if (this.udataService.user.initialized) {
        this.router.navigate(['carpools']);
        return;
      }
      else{
        this.router.navigate(['editprofile']);
        return;
      }
    }
  }
}
