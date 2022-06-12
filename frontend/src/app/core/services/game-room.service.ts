import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { GameRoomDto } from '../../shared/models/GameRoomDto';
import { MapDto } from '../../shared/models/MapDto';
import { RaceMap } from '../../shared/models/RaceMap';
import { User } from '../../shared/models/User';
import { Vector } from '../../shared/models/Vector';
import { MapService } from './map.service';
import { UserService } from './user.service';
import { catchError, retry, tap } from 'rxjs/operators';
import { GameRoomResponse } from '../../payload/GameRoomResponse';
import {Player} from "../../shared/models/Player";
import {PlayerInitialCoord} from "../../shared/models/PlayerInitialCoord";

@Injectable({
  providedIn: 'root'
})
export class GameRoomService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token,
    })
  };

  userId = JSON.parse(localStorage.getItem("jwtResponse")).id;
  idCounter = 0;
  changes: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  gameRoomDto: GameRoomDto;

  gameStarted : boolean = false;

  constructor(private mapService: MapService, private userServiece: UserService, private http: HttpClient) { }

  getGameRoom(id: number) : Observable<GameRoomResponse> {
    return this.http.get<GameRoomResponse>("http://localhost:8080/game-room/" + id, this.httpOptions);
  }

  getPlayers(roomId: number) : Observable<User[]> {
    return this.http.get<User[]>("http://localhost:8080/game-room/" + roomId + "/users-list/" + this.userId, this.httpOptions);
  }

  //zwracane GameId dla gracza
  getGameStarted(roomId: number) : Observable<number>{
    return this.http.get<number>("http://localhost:8080/game-room/" + roomId + "/game-started", this.httpOptions);
  }

  getRandomGameRoomId() : Observable<number> {
    return this.http.get<number>("http://localhost:8080/game-room/random/" + this.userId, this.httpOptions);
  }

  createGameRoom(mapId: number, playersLimit: number, roundTime: number, gameMasterId: number) : Observable<GameRoomResponse>{


    console.log("Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token)
    return this.http.post<GameRoomResponse>(
      "http://localhost:8080/game-room/",
      {
        mapId: mapId,
        playersLimit: playersLimit,
        roundTime: roundTime,
        gameMasterId: gameMasterId
      },
      this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // handleError<T>(arg0: string): (err: any, caught: Observable<any>) => import("rxjs").ObservableInput<any> {
  //   console.log(arg0)
  //   throw new Error('Method not implemented.');
  // }


  deleteUser(gameRoomId : number, userId: number): Observable<unknown> {
    const url ='http://localhost:8080/game-room/' + gameRoomId + '/users-list/' + userId;
    return this.http.delete(url, this.httpOptions)
      .pipe(
        catchError(this.handleError))
  }

  addUser(gameRoomId : number, userId : number) : Observable<User>{
    // ja nie wiem, jak to inaczej zeby dzialalo
    const requestOptions: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token,
      }),
      responseType: 'text',
    };

    return this.http.post<User>(
      "http://localhost:8080/game-room/" + gameRoomId + "/users-list/" + userId,
      {},
      requestOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  //zwracane gameId dla GameMastera
  startGame(gameRoomId : number) : Observable<number>{
    return this.http.get<number>(
      "http://localhost:8080/game-room/" + gameRoomId + "/game",
      this.httpOptions).pipe(
        catchError(this.handleError)
    )
  }
  initGame(playersList: Array<Player>, gameId: number){
    console.log(gameId);
    const colors = ["#be76fa", "#2861fa", "#e5795b", "#93d35b", "#ff89d8", "#f6250d", "#7a250d", "#7a1a97", "#7ca042", "#969293", "#489293"];
    return this.http.post<number>(
      "http://localhost:8080/game/" + gameId, playersList.map(player => new PlayerInitialCoord(player.playerId, player.position.x, player.position.y, colors[Math.floor(Math.random() * colors.length)])),
      this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  deleteGameRoom(gameRoomId : number){
    return this.http.delete("http://localhost:8080/game-room/" + gameRoomId, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
