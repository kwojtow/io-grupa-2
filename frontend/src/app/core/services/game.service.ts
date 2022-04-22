import { Injectable } from '@angular/core';
import {Game} from "../../shared/models/Game";
import {Player} from "../../shared/models/Player";
import { map, Observable} from "rxjs";
import {MockDataProviderService} from "./mock-data-provider.service";
import {MapService} from "./map.service";
import {PlayerState} from "../../shared/models/PlayerState";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Vector } from 'src/app/shared/models/Vector';

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
              private _httpClient: HttpClient) {
    this.setGameInfo(mockDataProvider.getPlayer(), //TODO: set authorized user
      mockDataProvider.getGame()); // TODO: set game when game starting
  }
  setGameInfo(authorizedPlayer: Player, game: Game){
    this._player = authorizedPlayer;
    this._game =   game;
    MapService.game = game;
    this._mapService.map = game.map;
  }

  getMockGameState(): Observable<Array<PlayerState>>{
    return this.mockDataProvider.getGameState();
  }
  getGameState(): Observable<Array<PlayerState>>{
    return this._httpClient.get<Array<any>>(this.API_URL + '/game/' + this._game.gameId + '/state')
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
    console.log('asdf')
    const playerPositionInfo = {
      playerId: player.playerId,
      xCoordinate: player.position.posX,
      yCoordinate: player.position.posY,
      vector: player.currentVector,
      playerStatus: player.playerStatus
    };
    // const headers = {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
    //   'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, API-Key, Authorization, X-Test',
    //   'Access-Control-Max-Age': '240',
    //   'Access-Control-Allow-Credentials': 'true',
    //   'Content-Type': 'application/json',
    //   'Authorization': 'aspdofijdsfpa' 
      
    //   // 'Access-Control-Allow-Origin': 'http://localhost:8080/game/1/state'
    // };

    const options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'my-auth-token',

        'access-control-allow-origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, API-Key, Authorization, X-Test',
      'Access-Control-Max-Age': '240',
      'Access-Control-Allow-Credentials': 'true'
      })
    };
    return this._httpClient.post<any>(this.API_URL + '/game/' + this._game.gameId + '/state', playerPositionInfo, options).
    subscribe(res => console.log(res));
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
