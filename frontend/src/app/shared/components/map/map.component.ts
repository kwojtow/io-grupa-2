import {Component, OnInit} from '@angular/core';
import { Player } from '../../models/Player';
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

  private static getExamplePlayers(){
    let player1 = new Player(new Vector(5, 5), 'green');
    let player2 = new Player(new Vector(6, 2), 'red');
    let player3 = new Player(new Vector(12, 9), 'yellow');
    return new Array(player1, player2, player3);
  }

  ngOnInit(): void {
    const canvas: HTMLElement | null = document.getElementById('canvas');
    if(canvas != null) {
      this.initMap(<HTMLCanvasElement>canvas, MapComponent.getExampleMap(), MapComponent.getExamplePlayers());
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

  private drawPlayers(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap, players: Array<Player>){
    const fieldWidth = MapComponent.getFieldWith(canvas, map);
    players.forEach(player => player.drawPlayer(ctx, fieldWidth, this.LINE_WIDTH));
  }

  private drawPlayerVectors(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap, player: Player) {
    const fieldWidth = MapComponent.getFieldWith(canvas, map);
    player.showCurrentVector(ctx, fieldWidth, this.LINE_WIDTH);
  }

  initMap(canvas: HTMLCanvasElement, map: RaceMap, players: Array<Player>){
    const ctx = canvas.getContext("2d");

    if(ctx != null) {
      this.drawMapNet(canvas, ctx, map);
      this.drawStartAndFinishLines(canvas, ctx, map);
      this.drawObstaclesLines(canvas, ctx, map);
      this.drawPlayers(canvas, ctx, map, players);
      this.drawPlayerVectors(canvas, ctx, map, players[0]);
    }
  }
}
