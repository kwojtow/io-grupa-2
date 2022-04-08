import {Component, Inject, OnInit} from '@angular/core';
import { Player } from '../../models/Player';
import {RaceMap} from "../../models/RaceMap";
import {Vector} from "../../models/Vector";
import {GameService} from "../../../services/game.service";
import {MapService} from "../../../services/map.service";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private _gameService: GameService,
              private _mapService: MapService) { }

  ngOnInit(): void {
    const canvas: HTMLElement | null = document.getElementById('canvas');
    this._gameService.game.subscribe(game => {
      if(canvas != null) {
        this.initMap(<HTMLCanvasElement>canvas, game.map, game.players);
        canvas.addEventListener('mousedown', function(e) {
          MapService.getCursorPosition(<HTMLCanvasElement>canvas, e);
        })
      }
    })


  }

  initMap(canvas: HTMLCanvasElement, map: RaceMap, players: Array<Player>){
    const ctx = canvas.getContext("2d");

    if(ctx != null) {
      this._mapService.drawMapNet(canvas, ctx, map);
      this._mapService.drawStartAndFinishLines(canvas, ctx, map);
      this._mapService.drawObstaclesLines(canvas, ctx, map);
      this._mapService.drawPlayers(canvas, ctx, map, players);
      this._mapService.drawPlayerVectors(canvas, ctx, map, players[0]);
    }
  }
}
