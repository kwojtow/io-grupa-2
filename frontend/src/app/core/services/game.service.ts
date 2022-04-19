import { Injectable } from '@angular/core';
import {Game} from "../../shared/models/Game";
import {RaceMap} from "../../shared/models/RaceMap";
import {Vector} from "../../shared/models/Vector";
import {Player} from "../../shared/models/Player";
import {GameSettings} from "../../shared/models/GameSettings";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {MockDataProviderService} from "./mock-data-provider.service";
import {MapService} from "./map.service";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _player: Player;                        // authorized user
  private _playerRound: BehaviorSubject<Player>; // player currently playing
  private _game: Game;                          // TODO: set game when game starting
  private _gameId: number;
  static idx = 1;

  constructor(private mockDataProvider: MockDataProviderService,
              private _mapService: MapService) {
    mockDataProvider.setExampleData();
    this.setGameInfo(mockDataProvider.getPlayer(), mockDataProvider.getGame());
    this.updateGameState();
    mockDataProvider.startIntervalChanges();

  }
  setGameInfo(player: Player, game: Game){
    this._player = player;    // auth user from userService
    this._game =   game;
    this._mapService.map = game.map;
    this._gameId = game.gameId;
  }
  updateGameState(){
    this._playerRound = this.mockDataProvider.playerRound; //GameState GET in every 0.5sec
    this.mockDataProvider.game;
  }
  getGameState(): Observable<Array<Player>>{
    return this.mockDataProvider.getGameState();
  }
  updateMap(playersList: Array<Player>){
    this._mapService.initMap(this.game.map, playersList);
  }
  get game(): Game {
    return this._game;
  }

  get playerRound(): Subject<Player> {
    return this._playerRound;
  }

  get player(): Player {
    return this._player;
  }

  get gameId(): number {
    return this._gameId;
  }

}
