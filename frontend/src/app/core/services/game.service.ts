import { Injectable } from '@angular/core';
import {Game} from "../../shared/models/Game";
import {RaceMap} from "../../shared/models/RaceMap";
import {Vector} from "../../shared/models/Vector";
import {Player} from "../../shared/models/Player";
import {GameSettings} from "../../shared/models/GameSettings";
import {BehaviorSubject, map, Observable, Subject} from "rxjs";
import {MockDataProviderService} from "./mock-data-provider.service";
import {MapService} from "./map.service";
import {PlayerState} from "../../shared/models/PlayerState";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _player: Player;                        // authorized user
  private _game: Game;
  private _gameId: number;

  constructor(private mockDataProvider: MockDataProviderService,
              private _mapService: MapService,
              private _httpClient: HttpClient) {
    this.setGameInfo(mockDataProvider.getPlayer(), mockDataProvider.getGame()); // TODO: set game when game starting
  }
  setGameInfo(player: Player, game: Game){
    this._player = player;    // auth user from userService
    this._game =   game;
    this._mapService.map = game.map;
    this._gameId = game.gameId;
  }

  getMockGameState(): Observable<Array<PlayerState>>{
    return this.mockDataProvider.getGameState();
  }
  getGameState(): Observable<Array<any>>{
    return this._httpClient.get<Array<any>>('http://localhost:8080/game/' + this._gameId + '/state') // TODO: move url to consts
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
  updateMap(playersList: Array<Player>){
    this._mapService.initMap(this.game.map, playersList);
  }
  get game(): Game {
    return this._game;
  }

  get player(): Player {
    return this._player;
  }

  get gameId(): number {
    return this._gameId;
  }

}
