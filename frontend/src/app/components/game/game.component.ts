import { Component, OnInit } from '@angular/core';
import {GameService} from "../../services/game.service";
import {Player} from "../../shared/models/Player";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  usersList: Player[];
  timer: number;
  currentPlayer: Player;
  player: Player;
  roomId: number;

  constructor(private _gameService: GameService) {
    this.usersList = _gameService.game.players;
    this.timer = _gameService.game.settings.roundTime;
    _gameService.playerRound
      .subscribe(player => this.currentPlayer = player);
    this.player = _gameService.player;
    this.roomId = _gameService.roomId;
  }

  ngOnInit(): void {
  }

  leaveGame() {
    //TODO: leave game
  }
}
