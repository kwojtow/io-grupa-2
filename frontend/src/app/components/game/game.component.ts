import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from "../../core/services/game.service";
import {Player} from "../../shared/models/Player";
import {interval, mergeMap, Observable, Subscription, timer} from "rxjs";
import {PlayerState} from "../../shared/models/PlayerState";
import {ActivatedRoute, Router} from "@angular/router";
import {Game} from "../../shared/models/Game";
import {MockDataProviderService} from "../../core/services/mock-data-provider.service";
import {GameSettings} from "../../shared/models/GameSettings";
import {UserService} from "../../core/services/user.service";
import { Vector } from 'src/app/shared/models/Vector';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  playersList: Player[];
  timer: number;
  currentPlayer: Player; //currently playing
  authorizedPlayer: Player;       // authorized user
  gameId: number;
  gameLoaded: boolean = false;
  gameSubscription: Subscription;
  gameEnd: boolean;
  constructor(private _gameService: GameService,
              private router: Router,
              private _route: ActivatedRoute,
              private userService: UserService) {
    this.gameId = +this._route.snapshot.params['id'];
    this._gameService.initGame(this.gameId);
    this._gameService.gameLoaded.subscribe(gameLoaded => {
      if(gameLoaded === true){
        this.playersList = _gameService.game.players;
        this.authorizedPlayer = _gameService.player;
        this._gameService.getTimerValue().subscribe(value => this.timer = value)
        if(this.gameSubscription === undefined)
          this.updateGameState();

        this.gameLoaded = true;
      }
    })
  }

  updateGameState(){
    if(this.authorizedPlayer != null)
      this._gameService.postPlayerNewPosition(this.authorizedPlayer);
    this.gameSubscription = timer(0, this._gameService.REFRESH_TIME) // GET game state in every 0.5s
      .pipe(mergeMap(() => this._gameService.getGameState(this.gameId))) // to test: getMockGameState()
      .subscribe(playersStates => {
          console.log('update')
          for(let state of playersStates) {
            if(state.playerStatus == 'WON'){
              let player = this._gameService.game.players.find(player => player.playerId === state.playerId);
              console.log('GRACZ ' + player.name + ' WYGRAŁ');
              this.gameEnd = true;
            }
          }

          let isWinner = true;
          for(let state of playersStates) {
            if(state.playerStatus != 'LOST' && state.playerId != this.authorizedPlayer.playerId){
              isWinner = false;
            }
          }
          if(isWinner) {
            this.authorizedPlayer.playerStatus = 'WON';
            this.authorizedPlayer.setNewVector(new Vector(0,0));
          }


          this.playersList = this._gameService.updatePlayersStates(playersStates);
        this.currentPlayer = this._gameService.updateCurrentPlaying(this.playersList);
        this._gameService.updateMap(this.playersList);
      },
        error => {
          if(error.status === 401){
            this.router.navigate(['/']);
          }
        })
  }
  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
    this._gameService.clearGame();
  }

  leaveGame() {
    this.gameEnd = true;
    // this.router.navigate(['start'])
  }

  getGameId(){
    return this._gameService.game.map.mapId;
  }

  getAvatar(avatar: string){
    return this.userService.convertImage(avatar);
  }
}
