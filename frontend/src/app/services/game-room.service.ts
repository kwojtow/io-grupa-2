import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameRoomDto } from '../shared/models/GameRoomDto';
import { MapDto } from '../shared/models/MapDto';
import { RaceMap } from '../shared/models/RaceMap';
import { User } from '../shared/models/User';
import { Vector } from '../shared/models/Vector';
import { MapService } from './map.service';
import { UserService } from './user.service';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameRoomService {
  idCounter = 0;
  changes : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  gameRoomDto : GameRoomDto;

  mockRoomsList : GameRoomDto[] = new Array(
    {
      id: 0,
      mapDto : {
        raceMap : new RaceMap(13, 10, [new Vector(1, 1), new Vector(2, 2)],
        [new Vector(3, 3), new Vector(4, 4)],
        [new Vector(7, 5), new Vector(8, 6)]),
        name: "Mapa 1",
        gamesPlayed : 121,
        rate : 4.2,
        author : {
          id: 1,
          nick: "test",
          email: "test@emal.com",
          avatar: "../../../../assets/resources/images/riFill-bus-2-fill 2.svg"
        } as User
      },
      playersLimit : 11,
      roundTime: 5,
      usersList: new Array({
        id: 1,
        nick: "test",
        email: "test@emal.com",
        avatar: "../../../../assets/resources/images/riFill-bus-2-fill 2.svg"
      } as User),
      owner : {
        id: 1,
        nick: "test",
        email: "test@emal.com",
        avatar: "../../../../assets/resources/images/riFill-bus-2-fill 2.svg"
      } as User
    }
  );


  constructor(private mapService: MapService, private userServiece : UserService, private http: HttpClient) { }

  getGameRoom(id : number) : GameRoomDto{
    console.log(this.mockRoomsList)
    return this.mockRoomsList[id]
  }

  getGameRoom2(id: number) : GameRoomDto {
    this.http.get<GameRoomDto>("/game-room/" + id).subscribe((data: GameRoomDto) => this.gameRoomDto = {
      id: data.id,
      mapDto: data.mapDto,
      playersLimit: data.playersLimit,
      roundTime: data.roundTime,
      usersList: data.usersList,
      owner: data.owner  })
      return this.gameRoomDto;
  }

  joinGameRoom(id : number){
    let gameRoomData = this.getGameRoom(id);
    if(gameRoomData){
      gameRoomData.usersList.push(this.userServiece.getCurrentLoggedUser());
    }

    this.update();
  }

  removePlayer(user : User) {

    console.log("userRemoved")
  }

  close(id : number){

    this.mockRoomsList.splice(id, 1);
  }

  createGameRoom(mapDto : MapDto, playersLimit : number, roundTime : number) : number{
    let gameRoomData : GameRoomDto = {
      id: this.mockRoomsList.length,
      mapDto : mapDto,
      playersLimit : playersLimit,
      roundTime: roundTime,
      usersList: new Array(this.userServiece.getCurrentLoggedUser()),
      owner : this.userServiece.getCurrentLoggedUser()
    }
    
    this.mockRoomsList.push(gameRoomData)

    return this.mockRoomsList.indexOf(gameRoomData)
  }

  getPlayers(id : number) : User[]{
    let players = new Array();
    players.push({ avatar: "../../../../assets/resources/images/riFill-bus-2-fill 2.svg", nick: "player1", expand: false })
    players.push({ avatar: "../../../../assets/resources/images/riFill-taxi-fill.svg", nick: "player2", expand: false })
    return players;
  }

  getMap(id : number) : MapDto{
    return this.mapService.getExampleMapData();
  }

  getRundTime(id : number){
    return this.mockRoomsList[id].roundTime;
  }

  update(){
    console.log("updatuje")
    this.changes.next(true);
  }
}
