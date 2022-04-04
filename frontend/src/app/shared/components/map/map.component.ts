import {Component, OnInit} from '@angular/core';
import {RaceMap} from "../../models/RaceMap";
import {Vector} from "../../models/Vector";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  LINE_WIDTH = 5;
  FINISH_LINE_COLOR = 'black';
  START_LINE_COLOR = 'blue';
  OBSTACLE_COLOR = 'black';

  constructor() { }

  private static getExampleMap(){
    const width = 13;
    const height = 10;
    return new RaceMap(width, height, [new Vector(1, 1), new Vector(2, 2)],
      [new Vector(3, 3), new Vector(4, 4)],
      [new Vector(7, 5), new Vector(8, 6)]);
  }

  ngOnInit(): void {
    const canvas: HTMLElement | null = document.getElementById('canvas');
    if(canvas != null) {
      this.initMap(<HTMLCanvasElement>canvas, MapComponent.getExampleMap());
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
    const n = fieldWidth/5;
    const x = v.posX * fieldWidth + this.LINE_WIDTH;
    const y = v.posY * fieldWidth + this.LINE_WIDTH;
    const padd = this.LINE_WIDTH * 2;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + n);
    ctx.lineTo(x + fieldWidth - n - padd, y + fieldWidth - padd);
    ctx.lineTo(x + fieldWidth - padd, y + fieldWidth - padd);
    ctx.lineTo(x + fieldWidth - padd, y + fieldWidth - n - padd);
    ctx.lineTo(x + n , y);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + fieldWidth - padd, y);
    ctx.lineTo(x + fieldWidth - padd, y + n);
    ctx.lineTo(x + n, y + fieldWidth - padd);
    ctx.lineTo(x, y + fieldWidth - padd);
    ctx.lineTo(x , y + fieldWidth - n - padd);
    ctx.lineTo(x + fieldWidth - n - padd , y);
    ctx.fill();

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

  private drawStartAndFinishLines(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap): void{
    const fieldWidth = MapComponent.getFieldWith(canvas, map);
    map.startLine.forEach(v => {
      this.drawCheckerSquare(ctx, v, fieldWidth, this.START_LINE_COLOR);
    });
    map.finishLine.forEach(v => {
      this.drawCheckerSquare(ctx, v, fieldWidth, this.FINISH_LINE_COLOR);
    });
  }

  private drawObstaclesLines(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap){
    const fieldWidth = MapComponent.getFieldWith(canvas, map);
    map.obstacles.forEach(v => {
      this.drawObstacle(ctx, v, fieldWidth, this.OBSTACLE_COLOR);
    });
  }

  private static getFieldWith(canvas: HTMLCanvasElement, map: RaceMap): number{
    const width = canvas.width;
    return Math.round(width/map.mapWidth);
  }

  private drawMapNet(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap){
    const width = canvas.width;
    const fieldWidth = MapComponent.getFieldWith(canvas, map)
    const mapHeight = map.mapHeight * fieldWidth;
    canvas.height = mapHeight;

    for(let i = 1; i < map.mapWidth ; i++){
      this.drawLine(ctx, fieldWidth * i, 0, fieldWidth * i, mapHeight);
    }
    for(let i = 1; i < map.mapHeight ; i++){
      this.drawLine(ctx, 0, fieldWidth * i, width, fieldWidth * i);
    }

  }
  initMap(canvas: HTMLCanvasElement, map: RaceMap){
    const ctx = canvas.getContext("2d");

    if(ctx != null) {
      this.drawMapNet(canvas, ctx, map);
      this.drawStartAndFinishLines(canvas, ctx, map);
      this.drawObstaclesLines(canvas, ctx, map);
    }
  }
}
