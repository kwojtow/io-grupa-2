import { Injectable } from '@angular/core';
import {Game} from "../../shared/models/Game";
import {Player} from "../../shared/models/Player";
import { map, Observable} from "rxjs";
import {MockDataProviderService} from "./mock-data-provider.service";
import {MapService} from "./map.service";
import {PlayerState} from "../../shared/models/PlayerState";
import {UserService} from "./user.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Vector } from 'src/app/shared/models/Vector';
import { JwtResponse } from 'src/app/shared/models/JwtResponse';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  readonly API_URL = 'http://localhost:8080';
  readonly REFRESH_TIME = 500;

  private _player: Player;                        // authorized user
  authorizedPlayer: Player;                          // currently playing user
  private _game: Game;

  constructor(private mockDataProvider: MockDataProviderService,
              private _mapService: MapService,
              private _httpClient: HttpClient,
              private _userService: UserService) {
    // Mock data to test game view (to delete)
    // this.setGameInfo(mockDataProvider.getPlayer(),
    //   mockDataProvider.getGame());
  }
    // TODO: set game when game starting
    setGameInfo(authorizedPlayer: Player, game: Game){
    this._player = authorizedPlayer;  //TODO: set authorized user
    this._game =   game;
    MapService.game = game;
    this._mapService.map.next(game.map);
  }

  getMockGameState(): Observable<Array<PlayerState>>{
    return this.mockDataProvider.getGameState();
  }
  getGameState(): Observable<Array<PlayerState>>{
    return this._httpClient.get<Array<any>>(this.API_URL + '/game/' + this._game.gameId + '/state',
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
        xcoordinate: player.position.posX,
        ycoordinate: player.position.posY,
        vector: {x: player.currentVector.posX, y: player.currentVector.posY},
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
      this._game.players.find(player => player.playerId === playerState.playerId)?.updateState(playerState);
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

  get player(): Player {
    return this._player;
  }

}
