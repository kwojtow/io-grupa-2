import {Vector} from "./Vector";

export class PlayerState{
  private _currentPosition: Vector;
  private _playerId: number;
  private _playerStatus: string;
  private _currentVector: Vector;


  constructor(playerId: number, playerStatus: string, xCoordinate: number, yCoordinate: number, currentVector: Vector) {
    this._currentPosition = new Vector(xCoordinate, yCoordinate);
    this._playerId = playerId;
    this._playerStatus = playerStatus;
    this._currentVector = currentVector;
  }


  get currentPosition(): Vector {
    return this._currentPosition;
  }

  get playerId(): number {
    return this._playerId;
  }

  get playerStatus(): string {
    return this._playerStatus;
  }

  get currentVector(): Vector {
    return this._currentVector;
  }
}
