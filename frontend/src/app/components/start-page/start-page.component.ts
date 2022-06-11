import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {
  userName: string;

  constructor(public dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.userName = JSON.parse(window.localStorage.getItem('jwtResponse')).username;
   
  }

  changeDialogStatus(){
    this.dataService.updateStatus(true);
  }

  logout(){
    window.localStorage.removeItem('jwtResponse');
    this.router.navigate(['/signin']);
  }

}
