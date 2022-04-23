import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { User } from 'src/app/shared/models/User';
import {UserStatistics} from "../../shared/models/UserStatistics";
import {UserRanks} from "../../shared/models/UserRanks";
import {RaceMap} from "../../shared/models/RaceMap";
import {map, Observable} from "rxjs";
import { Vector } from 'src/app/shared/models/Vector';
import { JwtResponse } from 'src/app/shared/models/JwtResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl: string;
  private user: User;

  constructor(private http: HttpClient) {
  }

  public addUser(user: User) {
    const requestOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text',
    };

    return this.http.post<User>(
      'http://localhost:8080/auth/signup',
      user,
      requestOptions
    );
  }

  public logUser(user: User) {
    return this.http.post<JwtResponse>('http://localhost:8080/auth/signin', user);
  }
  public getUserData(userId: number){

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token,
      })
    };
    return this.http.get<User>("http://localhost:8080/user/" + userId, httpOptions);
  }

  getCurrentLoggedUserId() : number{
    return JSON.parse(localStorage.getItem("jwtResponse")).id;
  }
  public getUser() { // TODO: ??
    return this.http.get<User>('http://localhost:8080/user', this.getAuthorizationHeaders());
  }
  getAuthorizationHeaders() {
    const jwt = localStorage.getItem('jwtResponse');
    let requestOptions;
    if (jwt !== null) {
      const jwtJson = JSON.parse(jwt);
      const token = jwtJson['type'] + ' ' + jwtJson['token'];
      requestOptions = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
          .set('Authorization', token)

      };
      return requestOptions;
    }
  }

  public getUserStats(userId: number) {
    return this.http.get<UserStatistics>('http://localhost:8080/statistics/user/' + userId, this.getAuthorizationHeaders())
  }

  public getUserRanksInfo(userId: number) {
    return this.http.get<UserRanks>('http://localhost:8080/user/' + userId + '/ranks', this.getAuthorizationHeaders())
  }

  //TODO
  public getMapsWithMostWins() {
    return this.http.get<any>('http://localhost:8080/map/user-wins', this.getAuthorizationHeaders())
  }
  //TODO
  public getMapsWithMostGames() {
  }

  public getUserMaps(authorId: number): Observable<Array<RaceMap>> {
    return this.http.get<any>('http://localhost:8080/map?authorId=' + authorId, this.getAuthorizationHeaders())
      .pipe(map(mapsList => {
        return mapsList.map((mapResponse: { mapId: number; name: string; userId: number; width: number; height: number; mapStructure: { finishLine: any[]; startLine: any[]; obstacles: any[]; }; }) =>
          new RaceMap(
            mapResponse.mapId,
            mapResponse.name,
            mapResponse.userId,
            mapResponse.width,
            mapResponse.height,
            mapResponse.mapStructure.finishLine.map(v => new Vector(v.x, v.y)),
            mapResponse.mapStructure.startLine.map(v => new Vector(v.x, v.y)),
            mapResponse.mapStructure.obstacles.map(v => new Vector(v.x, v.y))
          ))
        }
      ))
  }

}
