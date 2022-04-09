import {Vector} from "./Vector";

export class RaceMap{
  constructor( private readonly _mapWidth: number,
               private readonly _mapHeight: number,
               private readonly _finishLine: Array<Vector>,
               private readonly _startLine: Array<Vector>,
               private readonly _obstacles: Array<Vector> ){

    this._mapHeight = _mapHeight;
    this._mapWidth = _mapWidth;
    this._finishLine = _finishLine;
    this._startLine = _startLine;
    this._obstacles = _obstacles;
  }

  get mapWidth(): number {
    return this._mapWidth;
  }

  get mapHeight(): number {
    return this._mapHeight;
  }


  get finishLine(): Array<Vector> {
    return this._finishLine;
  }

  get startLine(): Array<Vector> {
    return this._startLine;
  }

  get obstacles(): Array<Vector> {
    return this._obstacles;
  }
}
