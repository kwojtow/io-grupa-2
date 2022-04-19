import { Component, OnInit } from '@angular/core';
import {GameService} from "../../core/services/game.service";
import {Player} from "../../shared/models/Player";
import {interval, mergeMap} from "rxjs";
import {PlayerState} from "../../shared/models/PlayerState";

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
      .pipe(mergeMap(() => this._gameService.getMockGameState())) // to test: getMockGameState()  // TODO: refactor
      .subscribe(playersList => {
        this.playersList.forEach(player => {
          // @ts-ignore
          return player.updateState(playersList.filter(player1 => player1.playerId === player.playerId).pop());
        })
        this._gameService.updateMap(this.playersList);
        // @ts-ignore
        this.currentPlayer = this.playersList.find(player => {
          // @ts-ignore
          const id = playersList.find(p1 => p1.playerStatus === 'PLAYING').playerId;
          return player.playerId === id;
        })
      })
  }
  ngOnInit(): void {
  }

  leaveGame() {
    //TODO: leave game
  }
}
