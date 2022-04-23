import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dialogStatus: boolean;


  updateStatus(status: boolean){
    this.dialogStatus = status;
  }
}
