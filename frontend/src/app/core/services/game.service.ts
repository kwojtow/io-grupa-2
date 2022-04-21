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
  readonly API_URL = 'http://localhost:8080';
  readonly REFRESH_TIME = 500;

  private _player: Player;                        // authorized user
  private _game: Game;

  constructor(private mockDataProvider: MockDataProviderService,
              private _mapService: MapService,
              private _httpClient: HttpClient) {
    this.setGameInfo(mockDataProvider.getPlayer(), //TODO: set authorized user
      mockDataProvider.getGame()); // TODO: set game when game starting
  }
  setGameInfo(player: Player, game: Game){
    this._player = player;
    this._game =   game;
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
  updateMap(playersList: Array<Player>){
    this._mapService.initMap(this.game.map, playersList);
  }
  get game(): Game {
    return this._game;
  }

  get player(): Player {
    return this._player;
  }

}
