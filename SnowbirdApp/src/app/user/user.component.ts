import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  loggedIn = false;
  username = "";
  password = "";

  constructor() { }

  ngOnInit(): void {
  }

  onCreateUser(){
    this.loggedIn = true;
    this.username = "test user";
    this.password = "password";
  }

}