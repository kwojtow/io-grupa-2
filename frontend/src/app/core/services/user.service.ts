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
  API_URL = 'http://localhost:8080'
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
      this.API_URL + '/auth/signup',
      user,
      requestOptions
    );
  }

  public logUser(user: User) {
    return this.http.post<JwtResponse>(this.API_URL + '/auth/signin', user);
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

  public getUser() { // TODO: ??
    return this.http.get<User>(this.API_URL + '/user', this.getAuthorizationHeaders());
  }

  public getUserStats(userId: number) {
    return this.http.get<UserStatistics>(this.API_URL + '/statistics/user/' + userId, this.getAuthorizationHeaders())
  }

  public getUserRanksInfo(userId: number) {
    return this.http.get<UserRanks>(this.API_URL + '/user/' + userId + '/ranks', this.getAuthorizationHeaders())
  }

  //TODO
  public getMapsWithMostWins() {
    return this.http.get<any>(this.API_URL + '/map/user-wins', this.getAuthorizationHeaders())
  }
  //TODO
  public getMapsWithMostGames() {
  }

  public getUserMaps(authorId: number): Observable<Array<RaceMap>> {
    return this.http.get<any>(this.API_URL + '/map?authorId=' + authorId, this.getAuthorizationHeaders())
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
