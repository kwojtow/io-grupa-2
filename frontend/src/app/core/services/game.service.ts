import { Injectable } from '@angular/core';
import {Game} from "../../shared/models/Game";
import {Player} from "../../shared/models/Player";
import {BehaviorSubject, map, Observable, Subject} from "rxjs";
import {MockDataProviderService} from "./mock-data-provider.service";
import {MapService} from "./map.service";
import {PlayerState} from "../../shared/models/PlayerState";
import {UserService} from "./user.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Vector } from 'src/app/shared/models/Vector';
import {ActivatedRoute} from "@angular/router";
import {GameSettings} from "../../shared/models/GameSettings";
import {GameRoomService} from "./game-room.service";
import {RaceMap} from "../../shared/models/RaceMap";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  readonly API_URL = 'http://localhost:8080';
  readonly REFRESH_TIME = 500;

  private _player: Player;                        // authorized user
  authorizedPlayer: Player;                          // currently playing user
  private _game: Game;

  gameLoaded = new BehaviorSubject<boolean>(false);

  constructor(private mockDataProvider: MockDataProviderService,
              private _mapService: MapService,
              private _httpClient: HttpClient,
              private _userService: UserService,
              private _route: ActivatedRoute,
              private _gameRoomService: GameRoomService) {

  }
  setGameInfo(authorizedPlayer: Player, game: Game){
    this._player = authorizedPlayer;
    this._game =   game;
    MapService.game = game;
    this._mapService.map.next(game.map);
    this.gameLoaded.next(true);
  }

  initGame(gameId: number){
    this._userService.getUser().subscribe(user => {
      this._gameRoomService.getPlayers(gameId).subscribe(users => {
        let players = new Array<Player>();
        let player;
        users
          .forEach(user => {
            players.push(new Player(user.userId, user.login, new Vector(0,0), 'green'))
          })
        this._gameRoomService.getGameRoom(gameId).subscribe(gameResponse => {
          this._mapService.getMap(gameResponse.mapId).subscribe(mapResponse => {
            player = players.find(player => player.playerId === user.userId)
            this.setGameInfo(player, new Game(gameId,
              new RaceMap(

              mapResponse.name,
              mapResponse.userId,
              mapResponse.width,
              mapResponse.height,
              mapResponse.mapStructure.finishLine,
              mapResponse.mapStructure.startLine,
              mapResponse.mapStructure.obstacles,
                mapResponse.mapId
              ),
              // MockDataProviderService.getExampleMap(),
              players, new GameSettings(gameResponse.roundTime)))
          })
        })
      })

    })
  }
  getMockGameState(): Observable<Array<PlayerState>>{
    return this.mockDataProvider.getGameState();
  }
  getGameState(gameId: number): Observable<Array<PlayerState>>{
    return this._httpClient.get<Array<any>>(this.API_URL + '/game/' + gameId + '/state',
      this._userService.getAuthorizationHeaders())
      .pipe(
        map(playersList => {
          return playersList.map(playerState =>
            new PlayerState(playerState.playerId,
              playerState.playerStatus,
              playerState.xcoordinate,
              playerState.ycoordinate))
        })
      );
  }
  postPlayerNewPosition(player: Player) {
    player.getChangedPosition().subscribe(() => {
      const playerPositionInfo = {
        playerId: player.playerId,
        xcoordinate: player.position.x,
        ycoordinate: player.position.y,
        vector: {x: player.currentVector.x, y: player.currentVector.y},
        playerStatus: player.playerStatus
      };
      const jwt = localStorage.getItem('jwtResponse');
      if(jwt !== null){
        const jwtJson = JSON.parse(jwt);
        const token = jwtJson['type'] + ' ' + jwtJson['token'];
        console.log(token);
        const requestOptions: Object = {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
                                    .set('Authorization', token)
        };
        return this._httpClient.post<any>(this.API_URL + '/game/' + this._game.gameId + '/state',
                                          playerPositionInfo,
                                          requestOptions
                                          ).subscribe(res => console.log(res));
      }
    })
  }
  updateCurrentPlaying(players: Array<Player>): Player | undefined{
    this.authorizedPlayer = players.find(player => player.playerStatus === 'PLAYING');
    return this.authorizedPlayer;
  }
  updatePlayersStates(playersStates: Array<PlayerState>){
    playersStates.forEach(playerState => {
      let player = this._game.players.find(player => player.playerId === playerState.playerId);
      if(player){
        for(let finish of this._game.map.finishLine){
          if(finish.equals(playerState.currentPosition) && !finish.equals(player.position)
           )
            setTimeout(function() { alert('Gracz ' + player.name + ' wygrał'); }, 1);
        }
        player.updateState(playerState);
      }
    })
    return this._game.players;
  }
  isMyTurn(): boolean{
    return this.authorizedPlayer?.playerId === this.player?.playerId;
  }
  updateMap(playersList: Array<Player>){
    this._mapService.initMap(this.game.map, playersList, this.isMyTurn(), this.player);
  }
  get game(): Game {
    return this._game;
  }

  set game(value: Game) {
    this._game = value;
  }

  get player(): Player {
    return this._player;
  }

}
