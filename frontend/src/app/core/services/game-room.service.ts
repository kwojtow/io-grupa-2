import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtResponse } from 'src/app/shared/models/JwtResponse';

@Injectable({
  providedIn: 'root',
})
export class GameRoomService {
  readonly API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  public joinGameRoom(gameID: number, userID: number) {
    const jwt = localStorage.getItem('jwtResponse');

    if (jwt != null) {
      const jwtJson = JSON.parse(jwt);
      const token = jwtJson.type + ' ' + jwtJson.token;

      const requestOptions: Object = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', token),
      };
      console.log(token);

      return this.http.post<String>(
        this.API_URL + '/game-room/' + gameID + '/users-list/' + userID,
        userID, requestOptions
      );
    }

    
  }
}
