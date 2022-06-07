import { Vector } from "./Vector";
import {PlayerState} from "./PlayerState";
import { Observable, Subject } from "rxjs";

export class Player{
  private _currentVector: Vector;
  private _playerStatus: string;
  private newVector = new Subject<Vector>();

  constructor(private _playerId: number,
              private _name: string,
              private _position: Vector,
               private _color: string,
               private _avatar: string) {
      this._playerId = _playerId;
      this._name = _name;
      this._color = _color;
      this._position = _position;
      this._currentVector = new Vector(0, 0);
      this._playerStatus = 'WAITING';
      this._avatar = _avatar
    }
  updateState(newState: PlayerState){
    if(newState.playerId === this._playerId){
      this._playerStatus = newState.playerStatus;
      this.position = newState.currentPosition;
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
      return new Vector(this.position.x + this.currentVector.x,
                        this.position.y + this.currentVector.y);
    }


  public getCurrentVectorPositionPx(fieldWidth: number): Vector{
    return new Vector(this.getCurrentVectorPosition().x * fieldWidth,
                        this.getCurrentVectorPosition().y * fieldWidth);
    }
  public getAvailableVectors(): Array<Vector> {
    let xpos = this.currentVector.x + this.position.x;
    let ypos = this.currentVector.y + this.position.y;
    return [new Vector(xpos + 1, ypos), new Vector(xpos + 1, ypos + 1),
      new Vector(xpos, ypos + 1), new Vector(xpos - 1, ypos + 1),
      new Vector(xpos - 1, ypos), new Vector(xpos - 1, ypos - 1),
      new Vector(xpos, ypos - 1), new Vector(xpos + 1, ypos - 1),
      new Vector(xpos, ypos)];
    }

  public getAvailableVectorsFromVector(vector: Vector): Array<Vector> {
      let xpos = 2*vector.x + this.position.x;
      let ypos = 2*vector.y + this.position.y;
      return [new Vector(xpos + 1, ypos), new Vector(xpos + 1, ypos + 1),
        new Vector(xpos, ypos + 1), new Vector(xpos - 1, ypos + 1),
        new Vector(xpos - 1, ypos), new Vector(xpos - 1, ypos - 1),
        new Vector(xpos, ypos - 1), new Vector(xpos + 1, ypos - 1),
        new Vector(xpos, ypos)];
      }
  get name(): string {
    return this._name;
    }

  get avatar(): string {
    return this._avatar;
  }
  get playerStatus(): string {
    return this._playerStatus;
    }

  set playerStatus(value: string) {
    this._playerStatus = value;
    }

  public setNewVector(vector: Vector) {
    this.currentVector = vector;
    this.position = new Vector(this.position.x + vector.x, this.position.y + vector.y);

    this.newVector.next(this.currentVector);
  }

  public getChangedPosition(): Observable<Vector> {
    return this.newVector.asObservable();
  }
}
