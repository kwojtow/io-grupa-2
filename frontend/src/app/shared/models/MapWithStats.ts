import {RaceMap} from "./RaceMap";

export class MapWithStats {
  private _raceMap: RaceMap;
  private _games: number;


  constructor(raceMap: RaceMap, games?: number) {
    this._raceMap = raceMap;
    this._games = games;
  }


  get raceMap(): RaceMap {
    return this._raceMap;
  }

  get games(): number {
    return this._games;

  }
}
