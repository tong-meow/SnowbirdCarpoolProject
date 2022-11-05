import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

  public saveLocalData(key: string, value: string){
    localStorage.setItem(key, value);
  }

  public getLocalData(key: string){
    return localStorage.getItem(key);
  }

  public removeLocalData(key: string){
    localStorage.removeItem(key);
  }

  public clearLocalData(){
    localStorage.clear();
  }
}
