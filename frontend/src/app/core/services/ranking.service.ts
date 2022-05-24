import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RankEntry } from 'src/app/payload/RankEntry';
import { User } from 'src/app/shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token,
    })
  };

  constructor(private http : HttpClient) { }

  getPlayers() {
    return this.http.get<RankEntry[]>("http://localhost:8080/statistics/users-ranking", this.httpOptions);
  }
}
