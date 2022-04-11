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

    public showCurrentVector(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, fieldWidth: number, lineWidth: number, map: RaceMap): void {
        ctx.fillStyle = "#0066ff77";
        ctx.fillRect(fieldWidth * (this.currentVector.posX + this.position.posX) + lineWidth,
          fieldWidth * (this.currentVector.posY + this.position.posY) + lineWidth,
          fieldWidth - 2 * lineWidth,
          fieldWidth - 2 * lineWidth);


    }


  public getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent, raceMap: RaceMap): Vector {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect()
    const x = event.offsetX;
    const y = event.offsetY;
    // @ts-ignore
    if (ctx !== null) {
      const v = this.getIdxPosition(ctx,
        canvas,
        rect.width / raceMap.mapWidth, rect.height / raceMap.mapHeight,
        x, y);
        return v;
    }
    return new Vector(-1,-1);
  }

  public getIdxPosition(ctx: CanvasRenderingContext2D,
                        canvas: HTMLCanvasElement,
                        width: number,
                        height: number,
                        cursorPosX: number,
                        cursorPosY: number): Vector{
    return new Vector(Math.floor(cursorPosX/width),
      Math.floor(cursorPosY/height));
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
        const currentVectorPath = new Path2D();

        currentVectorPath.rect(fieldWidth * (this.currentVector.posX + this.position.posX) + lineWidth,
          fieldWidth * (this.currentVector.posY + this.position.posY) + lineWidth,
          fieldWidthWithLine,
          fieldWidthWithLine);
        
        for(let vector of availableVectors) {
            let p = new Path2D();
            
            p.rect(fieldWidth * (currentVector.posX + vector.posX) + lineWidth,
            fieldWidth * (currentVector.posY + vector.posY) + lineWidth,
            fieldWidthWithLine,
            fieldWidthWithLine);
            availableVectorsPaths.push(p);
            ctx.fill(p);
        }

        const thisPlayer = this;
        canvas.onmousemove = function(event) {
            let v = thisPlayer.getCursorPosition(canvas, event, map);
            // console.log(v);
            for(let i = 0; i < availableVectorsPaths.length; ++i) {
                const path = availableVectorsPaths[i];
                const vector = availableVectors[i];
                if(ctx.isPointInPath(path, v.posX*fieldWidth + 2*lineWidth, v.posY*fieldWidth + 2*lineWidth)){
                    ctx.fillStyle = "#00ff66ff";
                }
                else {
                    ctx.fillStyle = "#00ff6677";
                }
                ctx.clearRect(fieldWidth * (currentVector.posX + vector.posX) + lineWidth,
                fieldWidth * (currentVector.posY + vector.posY) + lineWidth,
                fieldWidthWithLine,
                fieldWidthWithLine);
                ctx.fill(path);
            }

            if(ctx.isPointInPath(currentVectorPath, v.posX*fieldWidth + 2*lineWidth, v.posY*fieldWidth + 2*lineWidth)){
                ctx.fillStyle = "#0066ffff";
            }
            else {
                ctx.fillStyle = "#0066ff77";
            }

            ctx.clearRect(fieldWidth * (thisPlayer.currentVector.posX + thisPlayer.position.posX) + lineWidth,
            fieldWidth * (thisPlayer.currentVector.posY + thisPlayer.position.posY) + lineWidth,
            fieldWidthWithLine,
            fieldWidthWithLine);
            ctx.fill(currentVectorPath);
        }

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
