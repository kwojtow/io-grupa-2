import {AfterViewInit, Component, ElementRef, Inject, Injectable, Input, OnInit, ViewChild} from '@angular/core';
import { Player } from '../../models/Player';
import {RaceMap} from "../../models/RaceMap";
import {GameService} from "../../../core/services/game.service";
import {MapService} from "../../../core/services/map.service";
import {BehaviorSubject} from "rxjs";


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
    this.ctx = this.getContext(canvas);
    this._mapService.canvas = this.canvasRef.nativeElement;
    // @ts-ignore
    this._mapService.ctx = this.ctx;

    if (canvas != null){
      canvas.addEventListener('mousedown', function(e: MouseEvent) {
        MapService.getCursorPosition(canvas, e);
      });
    }
    this._mapService.map.subscribe(map => {
      this._mapService.initMap(map, [], false);
    })

  }

  private getContext(canvas: HTMLCanvasElement){
    return canvas.getContext("2d");
  }

}
