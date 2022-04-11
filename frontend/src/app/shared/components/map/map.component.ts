import {AfterViewInit, Component, ElementRef, Inject, Injectable, OnInit, ViewChild} from '@angular/core';
import { Player } from '../../models/Player';
import {RaceMap} from "../../models/RaceMap";
import {GameService} from "../../../core/services/game.service";
import {MapService} from "../../../core/services/map.service";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  constructor(private _gameService: GameService,
              private _mapService: MapService) { }

  @ViewChild('canvasElement') canvasRef: ElementRef;
  private ctx: CanvasRenderingContext2D | null;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    if (canvas != null){
      canvas.addEventListener('mousedown', function(e: MouseEvent) {
        MapService.getCursorPosition(canvas, e);
      });
    }
    this._gameService.game.subscribe(game => {    // subscribe game changes (players moves etc)
      if(canvas != null) {
        this.initMap(canvas, game.map, game.players);
      }
    });
    this.ctx = this.getContext(canvas);
  }

  initMap(canvas: HTMLCanvasElement, map: RaceMap, players: Array<Player>){
    if(this.ctx != null) {
      this._mapService.drawMapNet(canvas, this.ctx, map);
      this._mapService.drawStartAndFinishLines(canvas, this.ctx, map);
      this._mapService.drawObstaclesLines(canvas, this.ctx, map);
      this._mapService.drawPlayers(canvas, this.ctx, map, players);
      this._mapService.drawPlayerVectors(canvas, this.ctx, map, players[0]);
    }
  }

  private getContext(canvas: HTMLCanvasElement){
    return canvas.getContext("2d");
  }

}
