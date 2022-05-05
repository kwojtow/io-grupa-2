export class Vector{
  constructor( private _x: number,
               private _y: number){
    this._x = _x;
    this._y = _y;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }
  equals(v: Vector): boolean{
    return v.x == this.x && v.y == this.y;
  }

  set x(value: number) {
    this._x = value;
  }

  set y(value: number) {
    this._y = value;
  }
}
