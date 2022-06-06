import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/shared/models/User';
import { UserStatistics } from '../../shared/models/UserStatistics';
import { UserRanks } from '../../shared/models/UserRanks';
import { RaceMap } from '../../shared/models/RaceMap';
import { map, Observable } from 'rxjs';
import { Vector } from 'src/app/shared/models/Vector';
import { JwtResponse } from 'src/app/shared/models/JwtResponse';
import { MapWithStats } from '../../shared/models/MapWithStats';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

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
  public getUserData(userId: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('jwtResponse')).token,
      }),
    };
    return this.http.get<User>(
      'http://localhost:8080/user/' + userId,
      httpOptions
    );
  }

  public convertImage(image: string){
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ image);
  }

  public uploadAvatar(imageData: FormData){
    let id = JSON.parse(localStorage.getItem('jwtResponse'))['id'];
    const jwt = localStorage.getItem('jwtResponse');
    let requestOptions;
    if (jwt !== null) {
      const jwtJson = JSON.parse(jwt);
      const token = jwtJson['type'] + ' ' + jwtJson['token'];
      requestOptions = {
        headers: new HttpHeaders()
          .set('Authorization', token),
      };
    }
      return this.http.post('http://localhost:8080/user/'+id, imageData, requestOptions);
  }

  getCurrentLoggedUserId(): number {
    return JSON.parse(localStorage.getItem('jwtResponse')).id;
  }
  public getUser() {
    return this.http.get<User>(
      'http://localhost:8080/user',
      this.getAuthorizationHeaders()
    );
  }
  getAuthorizationHeaders() {
    const jwt = localStorage.getItem('jwtResponse');
    let requestOptions;
    if (jwt !== null) {
      const jwtJson = JSON.parse(jwt);
      const token = jwtJson['type'] + ' ' + jwtJson['token'];
      requestOptions = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', token),
      };
      return requestOptions;
    }
  }

  public getUserStats(userId: number) {
    return this.http.get<UserStatistics>(
      this.API_URL + '/statistics/user/' + userId,
      this.getAuthorizationHeaders()
    );
  }

  public getUserRanksInfo(userId: number) {
    return this.http.get<UserRanks>(
      this.API_URL + '/user/' + userId + '/ranks',
      this.getAuthorizationHeaders()
    );
  }

  public getMapsWithMostWins(): Observable<Array<MapWithStats>> {
    return this.http.get<any>(this.API_URL + '/map/user-wins', this.getAuthorizationHeaders())
      .pipe(map(mapList => {
        console.log(mapList)
        return this.convertMapListResponse(mapList)
      }))
  }

  public getMapsWithMostGames(): Observable<Array<MapWithStats>> {
    return this.http
      .get<any>(
        this.API_URL + '/map/user-games',
        this.getAuthorizationHeaders()
      )
      .pipe(
        map((mapList) => {
          return this.convertMapListResponse(mapList);
        })
      );
  }

  public getUserMaps(authorId: number): Observable<Array<MapWithStats>> {
    return this.http
      .get<any>(
        this.API_URL + '/map?authorId=' + authorId,
        this.getAuthorizationHeaders()
      )
      .pipe(
        map((mapsList) => {
          return mapsList.map(
            (mapResponse: {
              mapId: number;
              name: string;
              userId: number;
              width: number;
              height: number;
              mapStructure: {
                finishLine: any[];
                startLine: any[];
                obstacles: any[];
              };
            }) => new MapWithStats(this.convertMap(mapResponse)),
            0
          );
        })
      );
  }

  private convertMap(mapJson: {
    mapId: number;
    name: string;
    userId: number;
    width: number;
    height: number;
    mapStructure: { finishLine: any[]; startLine: any[]; obstacles: any[] };
  }): RaceMap {
    return new RaceMap(
      mapJson.name,
      mapJson.userId,
      mapJson.width,
      mapJson.height,
      mapJson.mapStructure.finishLine.map((v) => new Vector(v.x, v.y)),
      mapJson.mapStructure.startLine.map((v) => new Vector(v.x, v.y)),
      mapJson.mapStructure.obstacles.map((v) => new Vector(v.x, v.y)),
      mapJson.mapId
    );
  }
  convertMapListResponse(
    mapList: {
      map: {
        mapId: number;
        name: string;
        userId: number;
        width: number;
        height: number;
        mapStructure: { finishLine: any[]; startLine: any[]; obstacles: any[] };
      };
      games: number;
    }[]
  ) {
    return mapList.map(
      (mapResponse: {
        map: {
          mapId: number;
          name: string;
          userId: number;
          width: number;
          height: number;
          mapStructure: {
            finishLine: any[];
            startLine: any[];
            obstacles: any[];
          };
        };
        games: number;
      }) =>
        new MapWithStats(this.convertMap(mapResponse.map), mapResponse.games)
    );
  }
}
