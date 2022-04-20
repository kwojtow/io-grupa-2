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
    interval(500) // GET game state in every 0.5s
      .pipe(mergeMap(() => this._gameService.getMockGameState())) // to test: getMockGameState()
      .subscribe(playersStates => {
        this.updatePlayersStates(this.playersList, playersStates);
        this._gameService.updateMap(this.playersList);
        // @ts-ignore
        this.currentPlayer = this.getCurrentPlaying(this.playersList);
      })
  }
  ngOnInit(): void {
  }

  updatePlayersStates(players: Array<Player>, playersStates: Array<PlayerState>){
    playersStates.forEach(playerState => {
      players.find(player => player.playerId === playerState.playerId)?.updateState(playerState);
    })
  }
  getCurrentPlaying(players: Array<Player>): Player | undefined{
    return players.find(player => player.playerStatus === 'PLAYING');
  }

  leaveGame() {
    //TODO: leave game
  }
}
