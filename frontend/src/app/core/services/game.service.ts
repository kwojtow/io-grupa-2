import { Injectable } from '@angular/core';
import {Game} from "../../shared/models/Game";
import {RaceMap} from "../../shared/models/RaceMap";
import {Vector} from "../../shared/models/Vector";
import {Player} from "../../shared/models/Player";
import {GameSettings} from "../../shared/models/GameSettings";
import {BehaviorSubject, Subject} from "rxjs";
import {MockDataProviderService} from "./mock-data-provider.service";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _player: Player;                        // authorized user
  private _playerRound: BehaviorSubject<Player>; // player currently playing
  private _game: BehaviorSubject<Game>;
  private _roomId: number;
  static idx = 1;

  constructor(private mockDataProvider: MockDataProviderService) {
    mockDataProvider.setExampleData();
    this._player = mockDataProvider.player;
    this._game = mockDataProvider.game;
    this._playerRound = mockDataProvider.playerRound;
    this._roomId = 12345;
    mockDataProvider.startIntervalChanges();
  }


  get game(): BehaviorSubject<Game> {
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
