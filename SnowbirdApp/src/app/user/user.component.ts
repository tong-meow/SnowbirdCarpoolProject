import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { Router } from "@angular/router";
import { User } from '../model/user';
import { UdataService } from '../shared/udata.service';
import { GoogleAccount } from '../model/googleAccount';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  
    @Output() newUser = new EventEmitter<{}>();
    constructor(private udataService: UdataService,
                private router: Router) {}
    ngOnInit(): void {}

    gmail: string = this.udataService.getEmail();
    displayName: string = this.udataService.getDisplayName();
    private userObj: User = {
        uid: '',
        email: '',
        photoURL: '',
        type: 1,
        name: '',
        phone: '',
        address: '',
        hasCar: false,
        carMake: '',
        carModel: '',
        carLicense: '',
        carSeatsAvail: 0
    }

    onUpdateUser(username: HTMLInputElement, phone: HTMLInputElement, 
                email: HTMLInputElement, address: HTMLInputElement) {
      if (username.value == '' || address.value == '') {
        alert('Username and Phone are required.');
        return;
      }

      this.userObj.uid = this.udataService.getUid();
      this.userObj.photoURL = this.udataService.getPhotoURL();
      this.userObj.name = username.value;
      this.userObj.phone = phone.value;
      this.userObj.email = email.value;
      this.userObj.address = address.value;
    
      this.udataService.addUser(this.userObj);

      this.router.navigateByUrl('/carpools');
    }
}