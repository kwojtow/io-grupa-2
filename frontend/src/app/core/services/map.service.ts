import { Injectable } from '@angular/core';
import {RaceMap} from "../../shared/models/RaceMap";
import {Vector} from "../../shared/models/Vector";
import {Player} from "../../shared/models/Player";
import {Game} from "../../shared/models/Game";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  LINE_WIDTH = 5;
  FINISH_LINE_COLOR = 'black';
  START_LINE_COLOR = 'blue';
  OBSTACLE_COLOR = 'black';

  static game: Game;
  private _map: BehaviorSubject<RaceMap>;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;

  constructor() {
    this._map = new BehaviorSubject<RaceMap>(undefined);
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

  initMap(map: RaceMap, players: Array<Player>, isMyTurn: boolean, player?: Player,){
    if(this._ctx != null) {
      this.drawMapNet(this._canvas, this._ctx, map);
      this.drawStartAndFinishLines(this._canvas, this._ctx, map);
      this.drawObstaclesLines(this._canvas, this._ctx, map);
      if(players.length > 0){
        this.drawPlayers(this._canvas, this._ctx, map, players);
        let currentPlayer = players.find(p => p.playerId === player.playerId);
        if(isMyTurn && currentPlayer !== null)
          this.drawPlayerVectors(this._canvas, this._ctx, map, currentPlayer);
      }
    }
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

  public drawPlayer(player: Player, ctx: CanvasRenderingContext2D, fieldWidth: number, lineWidth: number): void{
    const miniFieldWidth = (fieldWidth - lineWidth * 2)/5;
    let car = new Path2D();
    ctx.fillStyle = player.color;
    let leftUpperX: number =  fieldWidth * player.position.posX + lineWidth;
    let leftUpperY: number = fieldWidth * player.position.posY + lineWidth;
    car.moveTo(leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*1.5);
    car.lineTo(leftUpperX + miniFieldWidth*4-10, leftUpperY + miniFieldWidth*1.5);

    car.quadraticCurveTo(leftUpperX + miniFieldWidth*4-10, leftUpperY + miniFieldWidth*1.5,
                         leftUpperX + miniFieldWidth*4, leftUpperY + miniFieldWidth*1.5+10);
    car.lineTo(leftUpperX + miniFieldWidth*4, leftUpperY + miniFieldWidth*3.5 - 10);
    car.quadraticCurveTo(leftUpperX + miniFieldWidth*4, leftUpperY + miniFieldWidth*3,
                         leftUpperX + miniFieldWidth*4-10, leftUpperY + miniFieldWidth*3.5);
    car.lineTo(leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*3.5);
    car.quadraticCurveTo(leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*3.5,
                         leftUpperX + miniFieldWidth, leftUpperY + miniFieldWidth*3.5-10);
    car.lineTo(leftUpperX + miniFieldWidth, leftUpperY + miniFieldWidth*1.5+10);
    car.quadraticCurveTo(leftUpperX + miniFieldWidth, leftUpperY + miniFieldWidth*1.5+10,
                         leftUpperX + miniFieldWidth+10, leftUpperY + miniFieldWidth*1.5);

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

  drawPlayers(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap, players: Array<Player>){
    const fieldWidth = MapService.getFieldWidth(canvas, map);
    players.forEach(player => this.drawPlayer(player, ctx, fieldWidth, this.LINE_WIDTH));
  }

  /**
   * function that check if there is an obstacle or a player on the field with
   * given vector
   */
  private onObstacle(vector: Vector, map: RaceMap): boolean {
    const obstacles = map.obstacles;
    const players = MapService.game.players;
    for(let obstacle of obstacles) {
      if(obstacle.equals(vector)) return true;
    }
    for(let player of players) {
      if(player.position.equals(vector)) return true;
    }
    return false;
  }

  private createArrow(fromx: number, fromy: number,
                      tox: number, toy: number, width: number, headlen: number): Path2D{


    let angle = Math.atan2(toy-fromy,tox-fromx);
    tox -= Math.cos(angle) * (width*1.15);
    toy -= Math.sin(angle) * (width*1.15);

    let p1 = new Path2D();

    p1.moveTo(fromx, fromy);
    p1.lineTo(tox, toy);

    let p2 = new Path2D()
    p2.moveTo(tox, toy);
    p2.lineTo(tox-headlen*Math.cos(angle-Math.PI/7), toy-headlen*Math.sin(angle-Math.PI/7));

    p2.lineTo(tox-headlen*Math.cos(angle+Math.PI/7), toy-headlen*Math.sin(angle+Math.PI/7));
    p2.lineTo(tox, toy);
    p2.lineTo(tox-headlen*Math.cos(angle-Math.PI/7), toy-headlen*Math.sin(angle-Math.PI/7));
    p1.addPath(p2);

    return p1;
  }

  private initArrows(fieldWidth: number, player: Player): Array<Path2D>{
    const currentVectorPositionPx = player.getCurrentVectorPositionPx(fieldWidth);
    const arrows = new Array<Path2D> (new Path2D(), new Path2D(), new Path2D(),new Path2D(),
                                      new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D());

    const arrowPositions = new Array<Array<Vector>>(
      [new Vector(fieldWidth*3/4, fieldWidth/2), new Vector(6*fieldWidth/4, fieldWidth/2)],
      [new Vector(fieldWidth*6/8, fieldWidth*3/4), new Vector(fieldWidth*5/4, fieldWidth*5/4)],
      [new Vector(fieldWidth/2, fieldWidth*3/4), new Vector(fieldWidth/2, fieldWidth*6/4)],

      [new Vector(fieldWidth*2/8, fieldWidth*3/4), new Vector(-fieldWidth*1/4, fieldWidth*5/4)],
      [new Vector(fieldWidth*1/4, fieldWidth/2), new Vector(-fieldWidth/2, fieldWidth/2)],
      [new Vector(fieldWidth*2/8, fieldWidth/4), new Vector(-fieldWidth/4, -fieldWidth/4)],
      [new Vector(fieldWidth/2, fieldWidth/4), new Vector(fieldWidth/2, -fieldWidth/2)],
      [new Vector(fieldWidth*6/8, fieldWidth/4), new Vector(fieldWidth*5/4, -fieldWidth/4)],
    );
    const arrowWidth = 12;
    const arrowHeadLen = 10;

    arrowPositions.forEach(arrowPosition => {
      let i = arrowPositions.indexOf(arrowPosition);
      arrows[i] =
        this.createArrow(arrowPosition[0].posX + currentVectorPositionPx.posX,
                         arrowPosition[0].posY + currentVectorPositionPx.posY,
                         arrowPosition[1].posX + currentVectorPositionPx.posX,
                         arrowPosition[1].posY + currentVectorPositionPx.posY,
                         arrowWidth, arrowHeadLen
                        );
    });
    arrows[arrows.length - 1].arc(currentVectorPositionPx.posX + fieldWidth/2,
    currentVectorPositionPx.posY + fieldWidth/2,
    fieldWidth/8, 0, Math.PI*2, true);

    return arrows;
  }

  private highlightAvaliableVectors(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap,
                                    player: Player, availableVectorsPaths: Array<Path2D>,
                                    arrows: Array<Path2D>): void {
    const lineWidth = this.LINE_WIDTH;
    const fieldWidth = MapService.getFieldWidth(canvas, map);
    const availableVectors = player.getAvailableVectors();
    let onObstacle = this.onObstacle;

    canvas.onmousemove = function(event) {
      let v = MapService.getCursorPosition(canvas, event);

      for(let i = availableVectorsPaths.length-1; i >= 0; --i) {
          const path = availableVectorsPaths[i];
          const vector = availableVectors[i];
          const isCurrentVector = vector.equals(player.getCurrentVectorPosition());
          const isPointInPath = ctx.isPointInPath(path, v.posX*fieldWidth + 2*lineWidth,
                                                  v.posY*fieldWidth + 2*lineWidth);
          const isOnObstacle = onObstacle(vector, map);

          if(isPointInPath) ctx.fillStyle =  (isCurrentVector) ? "#0066ffff" : "#00ff66ff";
          else ctx.fillStyle =  (isCurrentVector) ? "#0066ff77" : "#00ff6677";

          if(!isOnObstacle){
            ctx.clearRect(fieldWidth * vector.posX + lineWidth,
            fieldWidth * vector.posY + lineWidth,
            fieldWidth - 2 * lineWidth,
            fieldWidth - 2 * lineWidth);
            ctx.fill(path);
          }
          ctx.fillStyle = (isPointInPath && !isOnObstacle) ? "#cc8800" : "#454545";
          ctx.strokeStyle = (isPointInPath && !isOnObstacle) ? "#cc8800" : "#454545";

          if((!isCurrentVector || isPointInPath) && !isOnObstacle) ctx.fill(arrows[i]);
          ctx.stroke(arrows[i]);

      }
    }
  }


  drawPlayerVectors(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap, player: Player) {
      const fieldWidth = MapService.getFieldWidth(canvas, map);
      const availableVectorsPaths = new Array<Path2D>();
      const availableVectors = player.getAvailableVectors();

      // vectors
      for(let vector of availableVectors) {
          let p = new Path2D();
          availableVectorsPaths.push(p);
          ctx.fillStyle = (vector.equals(player.getCurrentVectorPosition())) ? "#0066ff77" : "#00ff6677";
          if(!this.onObstacle(vector, map) || vector.equals(player.getCurrentVectorPosition())){
            if(this.onObstacle(vector, map)) ctx.fillStyle = "#0066ff77";
            p.rect(fieldWidth * vector.posX + this.LINE_WIDTH,
                   fieldWidth * vector.posY + this.LINE_WIDTH,
                   fieldWidth - 2 * this.LINE_WIDTH,
                   fieldWidth - 2 * this.LINE_WIDTH);
            ctx.fill(p);
          }

      }

      // arrows
      const arrows = this.initArrows(fieldWidth, player);
      arrows.forEach(arrow => {
        ctx.lineWidth = 10;
        ctx.fillStyle = '#454545';
        ctx.strokeStyle = '#454545';
        let i = arrows.indexOf(arrow);
        if(i == arrows.length-1) {
          ctx.stroke(arrows[i]);
        }
        else {
          ctx.fill(arrows[i]);
          ctx.stroke(arrows[i]);
        }

      })
      this.highlightAvaliableVectors(canvas, ctx, map, player, availableVectorsPaths, arrows);
  }

  get map(): BehaviorSubject<RaceMap> {
    return this._map;
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }

  get ctx(): CanvasRenderingContext2D {
    return this._ctx;
  }

  set ctx(value: CanvasRenderingContext2D) {
    this._ctx = value;
  }

}
