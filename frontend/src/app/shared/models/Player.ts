import { MapService } from "src/app/core/services/map.service";
import { RaceMap } from "./RaceMap";
import { Vector } from "./Vector";
import {PlayerState} from "./PlayerState";

export class Player{
  private _currentVector: Vector;
  private _playerStatus: string;
  constructor(private _playerId: number,
              private _name: string,
              private _position: Vector,
               private _color: string) {
      this._playerId = _playerId;
      this._name = _name;
      this._color = _color;
      this._position = _position;
      this._currentVector = new Vector(0, 0);
      this._playerStatus = 'WAITING';
    }
  updateState(newState: PlayerState){
    if(newState.playerId === this._playerId){
      this._playerStatus = newState.playerStatus;
      this._position = newState.currentPosition;
      }
    }

  set position(_position: Vector) {
      this._position = _position;
    }

  get position(): Vector {
      return this._position;
    }

  set color(_color: string) {
      this._color = _color;
    }

  get color(): string {
      return this._color;
    }

  set currentVector(_currentVector: Vector) {
      this._currentVector = _currentVector;
    }

  get playerId(): number {
    return this._playerId;
    }

  get currentVector(): Vector {
        return this._currentVector;
    }

  public getCurrentVectorPosition(): Vector{
      return new Vector(this.position.posX + this.currentVector.posX,
                        this.position.posY + this.currentVector.posY);
    }


  public getCurrentVectorPositionPx(fieldWidth: number): Vector{
    return new Vector(this.getCurrentVectorPosition().posX * fieldWidth,
                        this.getCurrentVectorPosition().posY * fieldWidth);
    }
  public getAvailableVectors(): Array<Vector> {
    let xpos = this.currentVector.posX + this.position.posX;
    let ypos = this.currentVector.posY + this.position.posY;
    return [new Vector(xpos + 1, ypos), new Vector(xpos + 1, ypos + 1),
      new Vector(xpos, ypos + 1), new Vector(xpos - 1, ypos + 1),
      new Vector(xpos - 1, ypos), new Vector(xpos - 1, ypos - 1),
      new Vector(xpos, ypos - 1), new Vector(xpos + 1, ypos - 1),
      new Vector(xpos, ypos)];
    }
  get name(): string {
    return this._name;
    }
  get playerStatus(): string {
    return this._playerStatus;
    }

  set playerStatus(value: string) {
    this._playerStatus = value;
    }
}
