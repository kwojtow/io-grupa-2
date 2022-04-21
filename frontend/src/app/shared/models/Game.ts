import {RaceMap} from "./RaceMap";
import {Player} from "./Player";
import {GameSettings} from "./GameSettings";
import {Vector} from "./Vector";

export class Game{

  constructor(private _gameId: number, private _map: RaceMap, private _players: Player[], private _settings: GameSettings) {
    this._gameId = _gameId;
    this._map = _map;
    this._players = _players;
    this._settings = _settings;
  }

  get map(): RaceMap {
    return this._map;
  }

  set map(value: RaceMap) {
    this._map = value;
  }

  get players(): Player[] {
    return this._players;
  }

  set players(value: Player[]) {
    this._players = value;
  }

  get settings(): GameSettings {
    return this._settings;
  }

  set settings(value: GameSettings) {
    this._settings = value;
  }

  get gameId(): number {
    return this._gameId;
  }

}
