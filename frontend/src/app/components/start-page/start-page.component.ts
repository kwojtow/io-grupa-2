import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {
  userName: string;

  constructor(public dataService: DataService, public http: HttpClient, public router: Router) { }

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
  
  joinRandomGame(){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token,
      })
    };
    let userId = JSON.parse(localStorage.getItem("jwtResponse")).id;
    this.http.post<number>("http://localhost:8080/game-room/random/" + userId, {}, httpOptions).subscribe(roomId =>
      this.router.navigate(['game-room', roomId])
    );
  }

}
