import { Injectable } from '@angular/core';
import {RaceMap} from "../../shared/models/RaceMap";
import {Vector} from "../../shared/models/Vector";
import {Player} from "../../shared/models/Player";
import {MapComponent} from "../../shared/components/map/map.component";
import {GameService} from "./game.service";
import {Game} from "../../shared/models/Game";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  LINE_WIDTH = 5;
  FINISH_LINE_COLOR = 'black';
  START_LINE_COLOR = 'blue';
  OBSTACLE_COLOR = 'black';

  private static game: Game;

  constructor(private _gameService: GameService) {
    MapService.game = _gameService.game.getValue();
  }

  static getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent): Vector {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect()
    const x = event.offsetX;
    const y = event.offsetY;
    // @ts-ignore
    const raceMap = MapService.game.map;
    if (ctx !== null) {
      const v = MapService.getIdxPosition(ctx,
        canvas,
        rect.width / raceMap.mapWidth, rect.height / raceMap.mapHeight,
        x, y);
      console.log(v);
      console.log(MapService.game.getFieldProperty(v))
      return v;
    }
    return new Vector(-1, -1);
  }

  static getIdxPosition(ctx: CanvasRenderingContext2D,
                        canvas: HTMLCanvasElement,
                        width: number,
                        height: number,
                        cursorPosX: number,
                        cursorPosY: number): Vector{
    return new Vector(Math.floor(cursorPosX/width),
      Math.floor(cursorPosY/height));
  }

  private drawLine(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number){
    ctx.lineWidth = this.LINE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  private drawObstacle(ctx: CanvasRenderingContext2D, v: Vector, fieldWidth: number, color: string): void{

    ctx.fillStyle = color;

    ctx.fillRect(fieldWidth * v.posX + this.LINE_WIDTH,
      fieldWidth * v.posY + this.LINE_WIDTH,
      fieldWidth - 2 * this.LINE_WIDTH,
      fieldWidth - 2 * this.LINE_WIDTH);
  }

  private drawCheckerSquare(ctx: CanvasRenderingContext2D, v: Vector, fieldWidth: number, color: string){
    const miniFieldWidth = (fieldWidth - this.LINE_WIDTH * 2)/5;
    ctx.beginPath();
    ctx.fillStyle = color;
    for(let i = 0; i < 5; i ++){
      for(let j = 0; j < 5; j++){
        if((j % 2 == 0 && i % 2 == 0) || j% 2 == 1 && i % 2 == 1)
          ctx.fillRect(fieldWidth * v.posX + this.LINE_WIDTH + miniFieldWidth*i,
            fieldWidth * v.posY + this.LINE_WIDTH + miniFieldWidth*j,
            miniFieldWidth,
            miniFieldWidth);
      }
    }
    ctx.stroke();
  }

  drawStartAndFinishLines(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap): void{
    const fieldWidth = MapService.getFieldWidth(canvas, map);
    map.startLine.forEach(v => {
      this.drawCheckerSquare(ctx, v, fieldWidth, this.START_LINE_COLOR);
    });
    map.finishLine.forEach(v => {
      this.drawCheckerSquare(ctx, v, fieldWidth, this.FINISH_LINE_COLOR);
    });
  }

  drawObstaclesLines(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap){
    const fieldWidth = MapService.getFieldWidth(canvas, map);
    map.obstacles.forEach(v => {
      this.drawObstacle(ctx, v, fieldWidth, this.OBSTACLE_COLOR);
    });
  }

  private static getFieldWidth(canvas: HTMLCanvasElement, map: RaceMap): number{
    const width = canvas.width;
    return Math.round(width/map.mapWidth);
  }

  drawMapNet(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap){
    const width = canvas.width;
    const fieldWidth = MapService.getFieldWidth(canvas, map)
    const mapHeight = map.mapHeight * fieldWidth;
    canvas.height = mapHeight;

    for(let i = 1; i < map.mapWidth ; i++){
      this.drawLine(ctx, fieldWidth * i, 0, fieldWidth * i, mapHeight);
    }
    for(let i = 1; i < map.mapHeight ; i++){
      this.drawLine(ctx, 0, fieldWidth * i, width, fieldWidth * i);
    }

  }

  drawPlayers(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap, players: Array<Player>){
    const fieldWidth = MapService.getFieldWidth(canvas, map);
    players.forEach(player => player.drawPlayer(ctx, fieldWidth, this.LINE_WIDTH));
  }

  private highlightAvaliableVectors(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap, player: Player,
    availableVectorsPaths: Array<Path2D>, currentVectorPath: Path2D, onObstacle: CallableFunction): void {
      const lineWidth = this.LINE_WIDTH;
      const fieldWidth = MapService.getFieldWidth(canvas, map);
      const availableVectors = player.getAvailableVectors();
      
      canvas.onmousemove = function(event) {
        let v = MapService.getCursorPosition(canvas, event);
        for(let i = 0; i < availableVectorsPaths.length; ++i) {
            const path = availableVectorsPaths[i];
            const vector = availableVectors[i];
            if(ctx.isPointInPath(path, v.posX*fieldWidth + 2*lineWidth, v.posY*fieldWidth + 2*lineWidth)){
                ctx.fillStyle = "#00ff66ff";
            }
            else {
                ctx.fillStyle = "#00ff6677";
            }
            
            if(!onObstacle(vector)){
              ctx.clearRect(fieldWidth * vector.posX + lineWidth,
              fieldWidth * vector.posY + lineWidth,
              fieldWidth - 2 * lineWidth,
              fieldWidth - 2 * lineWidth);
              ctx.fill(path);
            }
        }

        if(ctx.isPointInPath(currentVectorPath, v.posX*fieldWidth + 2*lineWidth, v.posY*fieldWidth + 2*lineWidth)){
            ctx.fillStyle = "#0066ffff";
        }
        else {
            ctx.fillStyle = "#0066ff77";
        }

        if(!onObstacle(new Vector(player.currentVector.posX + player.position.posX, player.currentVector.posY + player.position.posY ))){
          ctx.clearRect(fieldWidth * (player.currentVector.posX + player.position.posX) + lineWidth,
          fieldWidth * (player.currentVector.posY + player.position.posY) + lineWidth,
          fieldWidth - 2 * lineWidth,
          fieldWidth - 2 * lineWidth);
          ctx.fill(currentVectorPath);
        }
      }

  }

  drawPlayerVectors(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap, player: Player) {
      const fieldWidth = MapService.getFieldWidth(canvas, map);
      const availableVectorsPaths = new Array<Path2D>();
      const availableVectors = player.getAvailableVectors();
      const currentVector = player.currentVector;
      // current vector
      ctx.fillStyle = "#0066ff77";    
      const currentVectorPath = new Path2D();

      currentVectorPath.rect(fieldWidth * (currentVector.posX + player.position.posX) + this.LINE_WIDTH,
      fieldWidth * (currentVector.posY + player.position.posY) + this.LINE_WIDTH,
      fieldWidth - 2 * this.LINE_WIDTH,
      fieldWidth - 2 * this.LINE_WIDTH);

      ctx.fill(currentVectorPath);

      // next vetors
      ctx.fillStyle = "#00ff6677";

      let obstacles = map.obstacles;
      function onObstacle(vector: Vector): boolean {
        for(let obstacle of obstacles) {
          if(obstacle.equals(vector)) {
            return true;
          }
        }
        return false;
      } 

      for(let vector of availableVectors) {
          let p = new Path2D();
          availableVectorsPaths.push(p);
          if(!onObstacle(vector)){
            p.rect(fieldWidth * vector.posX + this.LINE_WIDTH,
            fieldWidth * vector.posY + this.LINE_WIDTH,
            fieldWidth - 2 * this.LINE_WIDTH,
            fieldWidth - 2 * this.LINE_WIDTH);
            
            ctx.fill(p);
          }

      }

      this.highlightAvaliableVectors(canvas, ctx, map, player, availableVectorsPaths, currentVectorPath, onObstacle);
  }




}
