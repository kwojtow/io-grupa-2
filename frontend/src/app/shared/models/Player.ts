import { Vector } from "./Vector";

export class Player{
    constructor( private _position: Vector, 
                 private _color: string) {
        this._color = _color;
        this._position = _position;
    }

    get position(): Vector {
        return this._position;
    }

    get color(): string {
        return this._color;
    }
}