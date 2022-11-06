import { Component, OnInit } from '@angular/core';
// services
import { AuthService } from 'src/app/shared/auth.service';
import { GudataService } from 'src/app/shared/gudata.service';
import { UdataService } from 'src/app/shared/udata.service';
import { LocalService } from 'src/app/shared/local.service';
// router
import { Router } from "@angular/router";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})

export class LogInComponent implements OnInit {

  constructor(public authService: AuthService,
              private gudataService: GudataService,
              private udataService: UdataService,
              private localService: LocalService,
              private router: Router) { }

  ngOnInit() { 
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
}