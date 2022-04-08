import {RaceMap} from "./RaceMap";
import {Player} from "./Player";
import {GameSettings} from "./GameSettings";
import {Vector} from "./Vector";

export enum fieldProperty{
  PLAYER,
  OBSTACLE,
  FINISH,
  START,
  NEXT_VECTOR,
  PLAIN
}

export class Game{

  constructor(private _map: RaceMap, private _players: Player[], private _settings: GameSettings) {
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

  getFieldProperty(vector: Vector): fieldProperty{
    switch(true){
      case this.map.obstacles.some(v => v.equals(vector)):
        return fieldProperty.OBSTACLE;
      case this.map.finishLine.some(v => v.equals(vector)):
        return fieldProperty.FINISH;
      case this.map.startLine.some(v => v.equals(vector)):
        return fieldProperty.START;
      case this.players.some(p => p.position.equals(vector)):
        return fieldProperty.PLAYER;
      // case this._currentPlayer.currentVector.equals(vector): // TODO: possible moves vectors
      //   return fieldProperty.NEXT_VECTOR;
    }
    return fieldProperty.PLAIN;
  }

}
