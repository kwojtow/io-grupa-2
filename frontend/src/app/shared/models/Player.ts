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

    public showCurrentVector(ctx: CanvasRenderingContext2D, fieldWidth: number, lineWidth: number): void {
        ctx.fillStyle = "#0066ff77";

        ctx.fillRect(fieldWidth * (this.currentVector.posX + this.position.posX) + lineWidth,
          fieldWidth * (this.currentVector.posY + this.position.posY) + lineWidth,
          fieldWidth - 2 * lineWidth,
          fieldWidth - 2 * lineWidth);
    }
    
    public showAvailableMove(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, fieldWidth: number, lineWidth: number, map: RaceMap): void {
        ctx.fillStyle = "#00ff6677";
        const availableVectorsPaths = new Array<Path2D>();
        const availableVectors = [new Vector(this.position.posX+1, this.position.posY), new Vector(this.position.posX, this.position.posY+1),
                                  new Vector(this.position.posX+1, this.position.posY+1), new Vector(this.position.posX-1, this.position.posY),
                                  new Vector(this.position.posX, this.position.posY-1), new Vector(this.position.posX-1, this.position.posY-1),
                                  new Vector(this.position.posX+1, this.position.posY-1), new Vector(this.position.posX-1, this.position.posY+1)];
        const currentVector = this.currentVector;
        const fieldWidthWithLine = fieldWidth - 2 * lineWidth;
        for(let vector of availableVectors) {
            let p = new Path2D();
            
            p.rect(fieldWidth * (currentVector.posX + vector.posX) + lineWidth,
            fieldWidth * (currentVector.posY + vector.posY) + lineWidth,
            fieldWidthWithLine,
            fieldWidthWithLine);
            availableVectorsPaths.push(p);
            ctx.fill(p);
        }

    }

    public drawPlayer(ctx: CanvasRenderingContext2D, fieldWidth: number, lineWidth: number): void{
        const miniFieldWidth = (fieldWidth - lineWidth * 2)/5;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        let leftUpperX: number =  fieldWidth * this.position.posX + lineWidth;
        let leftUpperY: number = fieldWidth * this.position.posY + lineWidth;
        ctx.moveTo(leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*1.5);
        ctx.lineTo(leftUpperX + miniFieldWidth*4-10, leftUpperY + miniFieldWidth*1.5);
        ctx.quadraticCurveTo(leftUpperX + miniFieldWidth*4-10, leftUpperY + miniFieldWidth*1.5, leftUpperX + miniFieldWidth*4, leftUpperY + miniFieldWidth*1.5+10);
        ctx.lineTo(leftUpperX + miniFieldWidth*4, leftUpperY + miniFieldWidth*3.5 - 10);
        ctx.quadraticCurveTo(leftUpperX + miniFieldWidth*4, leftUpperY + miniFieldWidth*3, leftUpperX + miniFieldWidth*4-10, leftUpperY + miniFieldWidth*3.5);
        ctx.lineTo(leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*3.5);
        ctx.quadraticCurveTo(leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*3.5, leftUpperX + miniFieldWidth, leftUpperY + miniFieldWidth*3.5-10);
        ctx.lineTo(leftUpperX + miniFieldWidth, leftUpperY + miniFieldWidth*1.5+10);
        ctx.quadraticCurveTo(leftUpperX + miniFieldWidth, leftUpperY + miniFieldWidth*1.5+10, leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*1.5);

        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'black'
        ctx.fillRect(leftUpperX + miniFieldWidth+15, leftUpperY + miniFieldWidth*1.5-lineWidth-5, 15 , 10);
        ctx.fillRect(leftUpperX + miniFieldWidth*4-30, leftUpperY + miniFieldWidth*1.5-lineWidth-5, 15 , 10);
        ctx.fillRect(leftUpperX + miniFieldWidth+15, leftUpperY + miniFieldWidth*3.5, 15 , 10);
        ctx.fillRect(leftUpperX + miniFieldWidth*4-30, leftUpperY + miniFieldWidth*3.5, 15 , 10);
    }

  get name(): string {
    return this._name;
  }
}
