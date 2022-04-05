import { Vector } from "./Vector";

export class Player{
    private _currentVector: Vector;

    constructor( private _position: Vector, 
                 private _color: string) {
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
}