import {Vector} from "./Vector";

export class PlayerState{
  private _currentPosition: Vector;
  private _playerId: number;
  private _playerStatus: string;


  constructor(playerId: number, playerStatus: string, xCoordinate: number, yCoordinate: number ) {
    this._currentPosition = new Vector(xCoordinate, yCoordinate);
    this._playerId = playerId;
    this._playerStatus = playerStatus;
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
}
