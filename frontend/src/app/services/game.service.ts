import { Injectable } from '@angular/core';
import {Game} from "../shared/models/Game";
import {RaceMap} from "../shared/models/RaceMap";
import {Vector} from "../shared/models/Vector";
import {Player} from "../shared/models/Player";
import {GameSettings} from "../shared/models/GameSettings";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _player: Player;      // authorized user
  private _playerRound: BehaviorSubject<Player>; // player currently playing
  private _game: Game;
  private _roomId: number;
  static idx = 1;
  private static getExampleMap(){
    const width = 13;
    const height = 9;
    return new RaceMap(width, height, [new Vector(1, 1), new Vector(2, 2)],
      [new Vector(3, 3), new Vector(4, 4)],
      [new Vector(7, 5), new Vector(8, 6)]);
  }

  private static getExamplePlayers(){
    let player1 = new Player('Player1', new Vector(5, 5), 'green');
    player1.currentVector = new Vector(1, 2);
    let player2 = new Player('Player2',new Vector(6, 2), 'red');
    let player3 = new Player('Player3',new Vector(12, 9), 'yellow');
    return new Array(player1, player2, player3);
  }

  private static getExampleGameSettings(): GameSettings{
    return new GameSettings(5);
  }

  constructor() {
    this._game = new Game(GameService.getExampleMap(),  // todo: GET data from backend
      GameService.getExamplePlayers(),
      GameService.getExampleGameSettings());
    this._player = this.game.players[0];
    this._playerRound = new BehaviorSubject<Player>(this.game.players[0]);
    setInterval(function (player: Subject<Player>, players: Player[]){ player.next(players[GameService.idx]); GameService.idx =(GameService.idx+1)%3; }, 5000, this.playerRound, this.game.players)
    this._roomId = 12345;
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

  get roomId(): number {
    return this._roomId;
  }
}
