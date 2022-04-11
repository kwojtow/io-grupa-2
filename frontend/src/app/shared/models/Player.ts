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

    public getAvailableVectors(): Array<Vector>{
        return [new Vector(this.position.posX+1, this.position.posY), new Vector(this.position.posX, this.position.posY+1),
            new Vector(this.position.posX+1, this.position.posY+1), new Vector(this.position.posX-1, this.position.posY),
            new Vector(this.position.posX, this.position.posY-1), new Vector(this.position.posX-1, this.position.posY-1),
            new Vector(this.position.posX+1, this.position.posY-1), new Vector(this.position.posX-1, this.position.posY+1)];
    }


    public drawPlayer(ctx: CanvasRenderingContext2D, fieldWidth: number, lineWidth: number): void{
        const miniFieldWidth = (fieldWidth - lineWidth * 2)/5;
        let car = new Path2D();
        ctx.fillStyle = this.color;
        let leftUpperX: number =  fieldWidth * this.position.posX + lineWidth;
        let leftUpperY: number = fieldWidth * this.position.posY + lineWidth;
        car.moveTo(leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*1.5);
        car.lineTo(leftUpperX + miniFieldWidth*4-10, leftUpperY + miniFieldWidth*1.5);
        car.quadraticCurveTo(leftUpperX + miniFieldWidth*4-10, leftUpperY + miniFieldWidth*1.5, leftUpperX + miniFieldWidth*4, leftUpperY + miniFieldWidth*1.5+10);
        car.lineTo(leftUpperX + miniFieldWidth*4, leftUpperY + miniFieldWidth*3.5 - 10);
        car.quadraticCurveTo(leftUpperX + miniFieldWidth*4, leftUpperY + miniFieldWidth*3, leftUpperX + miniFieldWidth*4-10, leftUpperY + miniFieldWidth*3.5);
        car.lineTo(leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*3.5);
        car.quadraticCurveTo(leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*3.5, leftUpperX + miniFieldWidth, leftUpperY + miniFieldWidth*3.5-10);
        car.lineTo(leftUpperX + miniFieldWidth, leftUpperY + miniFieldWidth*1.5+10);
        car.quadraticCurveTo(leftUpperX + miniFieldWidth, leftUpperY + miniFieldWidth*1.5+10, leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*1.5);

        ctx.fill(car);
        ctx.stroke(car);


        ctx.fillStyle = 'black'
        let wheels = Array<Path2D> (new Path2D(), new Path2D(), new Path2D(), new Path2D());
        wheels[0].rect(leftUpperX + miniFieldWidth+15, leftUpperY + miniFieldWidth*1.5-lineWidth-5, 15 , 10);
        wheels[1].rect(leftUpperX + miniFieldWidth*4-30, leftUpperY + miniFieldWidth*1.5-lineWidth-5, 15 , 10);
        wheels[2].rect(leftUpperX + miniFieldWidth+15, leftUpperY + miniFieldWidth*3.5, 15 , 10);
        wheels[3].rect(leftUpperX + miniFieldWidth*4-30, leftUpperY + miniFieldWidth*3.5, 15 , 10);
        car.addPath(wheels[0]);
        wheels.forEach(wheel => ctx.fill(wheel));
    }

  get name(): string {
    return this._name;
  }
}
