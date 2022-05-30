import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

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

  joinRandomGame(){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token,
      })
    };
    this.http.post<number>("http://localhost:8080/game-room/random", {}, httpOptions).subscribe(roomId =>
      this.router.navigate(['game-room', roomId])
    );
  }

}
