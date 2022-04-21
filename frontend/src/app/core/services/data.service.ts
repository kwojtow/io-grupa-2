import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private userName = new BehaviorSubject<string>("");
  currentUserName = this.userName.asObservable();

  constructor() { }

  setUserName(userName : string){
    this.userName.next(userName);
  }
}
