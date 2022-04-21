import { Injectable } from '@angular/core';
import {RaceMap} from "../../shared/models/RaceMap";
import {Vector} from "../../shared/models/Vector";
import {Player} from "../../shared/models/Player";
import {GameSettings} from "../../shared/models/GameSettings";
import {Game} from "../../shared/models/Game";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {GameService} from "./game.service";
import {PlayerState} from "../../shared/models/PlayerState";

@Injectable({
  providedIn: 'root'
})
export class MockDataProviderService {
  private _game: Game;
  private _player: Player;
  private _playerRound: BehaviorSubject<Player>;
  private _roomId: number;
  private static _gameState: Array<PlayerState>;
  private _playersList: Array<Player>;
  static idx = 0;
  private static getExampleMap(){
    const width = 13;
    const height = 9;
    return new RaceMap(width, height, [new Vector(1, 1), new Vector(2, 2)],
      [new Vector(3, 3), new Vector(4, 4)],
      [new Vector(7, 5), new Vector(8, 6)]);
  }

  private static getExamplePlayers(){
    let player1 = new Player(1,'Player1', new Vector(5, 5), 'green');
    player1.currentVector = new Vector(1, 2);
    let player2 = new Player(2,'Player2',new Vector(6, 2), 'red');
    let player3 = new Player(3,'Player3',new Vector(8, 1), 'yellow');
    return new Array(player1, player2, player3);
  }

  getExamplePlayer(): Player{
    return new Player(1, 'Player1', new Vector(5, 5), 'green');
  }

  private static getExampleGameSettings(): GameSettings{
    return new GameSettings(5);
  }
  getPlayer(): Player {
    return MockDataProviderService.getExamplePlayers()[0];
  }

  getGame(): Game {
    this.startIntervalChanges();
    return new Game(1, MockDataProviderService.getExampleMap(),
      MockDataProviderService.getExamplePlayers(),
      MockDataProviderService.getExampleGameSettings());
  }

  getGameState(): Observable<Array<PlayerState>> {
    return new BehaviorSubject(MockDataProviderService._gameState);
  }

  startIntervalChanges(): void{
    setInterval(function (playersList: Array<Player>){
      playersList[MockDataProviderService.idx%3].position.posX = (playersList[MockDataProviderService.idx%3].position.posX + 1) % MockDataProviderService.getExampleMap().mapWidth;
      playersList[(MockDataProviderService.idx)%3].playerStatus = 'WAITING';
      playersList[(MockDataProviderService.idx + 1)%3].playerStatus = 'PLAYING';
      MockDataProviderService.idx += 1;
      MockDataProviderService._gameState = MockDataProviderService.mapPlayersToPlayersStates(playersList);
    }, 2000, this._playersList)

  }
  static mapPlayersToPlayersStates(players: Array<Player>): Array<PlayerState>{
    return players.map(player => {
      return new PlayerState(player.playerId, player.playerStatus, player.position.posX, player.position.posY);
    });
  }
  constructor() {
    this._playersList = MockDataProviderService.getExamplePlayers();
    this._playersList[0].playerStatus = 'PLAYING';
    MockDataProviderService._gameState =MockDataProviderService
      .mapPlayersToPlayersStates(this._playersList);
  }


  get game(): Game {
    return this._game;
  }

  get player(): Player {
    return this._player;
  }

  get playerRound(): BehaviorSubject<Player> {
    return this._playerRound;
  }

  get roomId(): number {
    return this._roomId;
  }


}
