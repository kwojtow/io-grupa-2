import { Component, OnInit } from '@angular/core';
import {GameService} from "../../core/services/game.service";
import {Player} from "../../shared/models/Player";
import {interval, mergeMap} from "rxjs";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  playersList: Player[];
  timer: number;
  currentPlayer: Player;
  player: Player;
  gameId: number;

  constructor(private _gameService: GameService) {
    this.gameId = _gameService.gameId;
    this.playersList = _gameService.game.players;
    this.timer = this._gameService.game.settings.roundTime;   // TODO: timer animation
    this.player = _gameService.player;
    this.updateGameState();
  }
  updateGameState(){
    interval(500)
      .pipe(mergeMap(() => this._gameService.getGameState()))// TODO: interval 0.5sec
      .subscribe(playersList => {
        console.log('update!')
        this._gameService.updateMap(playersList);
        this.currentPlayer = playersList[0]; // TODO!
      })


  }
  ngOnInit(): void {
  }

  leaveGame() {
    //TODO: leave game
  }
}
