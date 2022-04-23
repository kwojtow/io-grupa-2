import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {
  userName: string;

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.userName = JSON.parse(window.localStorage.getItem('jwtResponse')).username;
   
  }

  changeDialogStatus(){
    this.dataService.updateStatus(true);
  }

}
