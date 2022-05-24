import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
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
    this.ctx = this.getContext(canvas);
    this._mapService.canvas = this.canvasRef.nativeElement;
    // @ts-ignore
    this._mapService.ctx = this.ctx;

    if (canvas != null){
      canvas.addEventListener('mousedown', function(e: MouseEvent) {
        MapService.getCursorPosition(canvas, e);
      });
    }
    MapService.map.subscribe(map => {
      if(map !== undefined)
        this._mapService.initMap(map, [], false);
      else
        this.ctx.clearRect(0,0,canvas.width,canvas.height)
    })

  }

  private getContext(canvas: HTMLCanvasElement){
    return canvas.getContext("2d");
  }

}
