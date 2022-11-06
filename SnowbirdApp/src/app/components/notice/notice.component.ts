import { Component, OnInit } from '@angular/core';
// router
import { Router } from "@angular/router";
// services
import { GudataService } from '../../shared/gudata.service';
import { UdataService } from 'src/app/shared/udata.service';
import { LocalService } from 'src/app/shared/local.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {

  constructor(private gudataService: GudataService,
              private udataService: UdataService,
              private localService: LocalService,
              private router: Router) { }

  ngOnInit(): void {

    if (this.gudataService.account != undefined && this.udataService.user != undefined){
      if (!this.udataService.user.initialized){
        this.router.navigate(['editprofile']);
      }
      else{
        this.router.navigate(['carpools']);
      }
    }
    else if (this.localService.getLocalData("uid") != undefined){
      this.router.navigate(['carpools']);
    }

  }

  backToLogin(){
    this.router.navigate(['login']);
  }
}
