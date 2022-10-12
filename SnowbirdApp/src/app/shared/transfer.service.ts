import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';


@Injectable({
    providedIn: 'root'
})

export class TransferService {
    private app = initializeApp(environment.firebase);
    private data;

    constructor(private router: Router) { }

    setData(data){
      this.data = data;
    }
  
    getData(){
      let temp = this.data;
      this.clearData();
      return temp;
    }
  
    clearData(){
      this.data = undefined;
    }
}
