import { Injectable } from '@angular/core';
import {RaceMap} from "../../shared/models/RaceMap";
import {Vector} from "../../shared/models/Vector";
import {Player} from "../../shared/models/Player";
import {GameSettings} from "../../shared/models/GameSettings";
import {Game} from "../../shared/models/Game";
import {BehaviorSubject, Subject} from "rxjs";
import {GameService} from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class MockDataProviderService {
  private _game: BehaviorSubject<Game>;
  private _player: Player;
  private _playerRound: BehaviorSubject<Player>;
  private _roomId: number;
  static idx = 0;
  private static getExampleMap(){
    const width = 13;
    const height = 9;
    return new RaceMap(width, height, [new Vector(1, 1), new Vector(2, 2)],
      [new Vector(3, 3), new Vector(4, 4)],
      [new Vector(7, 5), new Vector(8, 6)]);
  }

  private static getExamplePlayers(){
    let player1 = new Player('Player1', new Vector(5, 4), 'green');
    player1.currentVector = new Vector(1, 2);
    let player2 = new Player('Player2',new Vector(6, 2), 'red');
    let player3 = new Player('Player3',new Vector(3, 3), 'yellow');
    return new Array(player1, player2, player3);
  }

  getExamplePlayer(): Player{
    return new Player('Player1', new Vector(5, 5), 'green');
  }

  private static getExampleGameSettings(): GameSettings{
    return new GameSettings(5);
  }

  setExampleData(){
    const players = MockDataProviderService.getExamplePlayers();
    this._game = new BehaviorSubject<Game>(new Game(MockDataProviderService.getExampleMap(),  // todo: GET data from backend
      players,
      MockDataProviderService.getExampleGameSettings()));
    this._player = players[0];
    this._playerRound = new BehaviorSubject<Player>(players[1]);
    this._roomId = 12345;
  }

  startIntervalChanges(): void{
    setInterval(function (player: Subject<Player>, players: Player[]){ player.next(players[GameService.idx]); GameService.idx =(GameService.idx+1)%2; }, 1000, this.playerRound, this.game.getValue().players)
    setInterval(function (game: BehaviorSubject<Game>){
      let newGame = game.getValue();
      newGame.players[MockDataProviderService.idx%2].position.posX = (newGame.players[MockDataProviderService.idx%2].position.posX + 1) % newGame.map.mapWidth;
      game.next(newGame);
      MockDataProviderService.idx += 1;
    }, 1000, this._game)

  }

  constructor() { }


  get game(): BehaviorSubject<Game> {
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
