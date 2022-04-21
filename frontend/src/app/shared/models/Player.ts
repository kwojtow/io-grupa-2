import { MapService } from "src/app/core/services/map.service";
import { RaceMap } from "./RaceMap";
import { Vector } from "./Vector";

export class Player{
    private _currentVector: Vector;

    constructor(private _name: string,
                private _position: Vector,
                 private _color: string) {
        this._name = _name;
        this._color = _color;
        this._position = _position;
        this._currentVector = new Vector(0, 0);
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

    public getAvailableVectors(): Array<Vector>{
        let xpos = this.currentVector.posX + this.position.posX;
        let ypos = this.currentVector.posY + this.position.posY;
        return [new Vector(xpos+1, ypos), new Vector(xpos+1, ypos+1),
                new Vector(xpos, ypos+1), new Vector(xpos-1, ypos+1),
                new Vector(xpos-1, ypos), new Vector(xpos-1, ypos-1),
                new Vector(xpos, ypos-1), new Vector(xpos+1, ypos-1),
                new Vector(xpos, ypos)];
    }

    get name(): string {
        return this._name;
    }
}
