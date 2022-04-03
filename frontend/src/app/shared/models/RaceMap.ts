import {Vector} from "./Vector";

export class RaceMap{
  constructor( private _mapWidth: number,
               private _mapHeight: number,
               private finishLine: Array<Vector>,
               private startLine: Array<Vector>,
               private obstacles: Array<Vector> ){

    this._mapHeight = _mapHeight;
    this._mapWidth = _mapWidth;
    this.finishLine = finishLine;
    this.startLine = startLine;
    this.obstacles = obstacles;
  }

  get mapWidth(): number {
    return this._mapWidth;
  }

  get mapHeight(): number {
    return this._mapHeight;
  }
}
