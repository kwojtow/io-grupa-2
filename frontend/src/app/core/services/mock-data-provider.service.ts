import { Injectable } from '@angular/core';
import {RaceMap} from "../../shared/models/RaceMap";
import {Vector} from "../../shared/models/Vector";
import {Player} from "../../shared/models/Player";
import {GameSettings} from "../../shared/models/GameSettings";
import {Game} from "../../shared/models/Game";
import {BehaviorSubject, Observable} from "rxjs";
import {PlayerState} from "../../shared/models/PlayerState";
import {MapWithStats} from "../../shared/models/MapWithStats";
import {User} from "../../shared/models/User";
import {UserStatistics} from "../../shared/models/UserStatistics";
import {UserRanks} from "../../shared/models/UserRanks";

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
  private static mapId = 1;

  static getExampleMap(){
    const width = 13;
    const height = 9;
    MockDataProviderService.mapId ++;
    return new RaceMap(MockDataProviderService.mapId, 'Map Name', 1, width, height, [new Vector(4, 6), new Vector(3, 7)],
      [new Vector(3 + MockDataProviderService.mapId, 3+ MockDataProviderService.mapId), new Vector(4+ MockDataProviderService.mapId, 4)],
      [new Vector(7+ MockDataProviderService.mapId, 5+ MockDataProviderService.mapId), new Vector(8, 6)]);

  }

  private static getExamplePlayers(){
    let player1 = new Player(1,'Player1', new Vector(5, 5), 'green');
    player1.currentVector = new Vector(1, 2);
    let player2 = new Player(2,'Player2',new Vector(6, 2), 'red');
    let player3 = new Player(3,'Player3',new Vector(8, 1), 'yellow');
    let player4 = new Player(4,'Player4',new Vector(4, 0), 'pink');
    player4.playerStatus = 'LOST';
    return new Array(player1, player2, player3, player4);
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

  getExampleMapResponseList(size: number){
    let mapList = new Array<MapWithStats>();
    for(let i = 0; i < size; i ++){
      const map = new MapWithStats(MockDataProviderService.getExampleMap(), MockDataProviderService.mapId);
      mapList.push(map);
    }
    return mapList;
  }
  getExampleUser(){
    return new User('User123', 'null', 'user123@abc.pl', 1, new UserStatistics(5, 10), new UserRanks(1, 123456));
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
