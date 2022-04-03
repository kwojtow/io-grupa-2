import {Component, OnInit} from '@angular/core';
import {RaceMap} from "../../models/RaceMap";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  private static getExampleMap(){
    const width = 13;
    const height = 10;
    return new RaceMap(width, height, [], [], []);
  }

  ngOnInit(): void {
    const canvas: HTMLElement | null = document.getElementById('canvas');
    if(canvas != null) {
      this.initMap(<HTMLCanvasElement>canvas, MapComponent.getExampleMap());
    }
  }


  drawLine(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number){
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

  }
  drawMapNet(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap){
    const width = canvas.width;
    const fieldWidth = Math.round(width/map.mapWidth);
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
      // draw obstacles
      // draw finishLine
      // draw startLine
    }

  }

}
