import { Component, OnInit } from '@angular/core';
import {MapService} from "../../core/services/map.service";
import {RaceMap} from "../../shared/models/RaceMap";
import {Vector} from "../../shared/models/Vector";

enum ObjectType{
  NONE, START, FINISH, OBSTACLE
}

@Component({
  selector: 'app-create-map',
  templateUrl: './create-map.component.html',
  styleUrls: ['./create-map.component.css']
})
export class CreateMapComponent implements OnInit {
  objectTypeEnum = ObjectType;
  map: RaceMap;
  chosenObject = ObjectType.NONE;

  constructor(private _mapService: MapService) {
    const userId: number = +localStorage.getItem('id');
    // TODO: size, name, sending, mapService.game.map???, full size, responsiveness save, cancel
    this.map = new RaceMap('', userId, 13, 7, [], [], []);
    _mapService.map.next(this.map);
  }

  ngOnInit(): void {
  }

  drawObject(event: MouseEvent) {
    const v = MapService.getCursorPosition(this._mapService.canvas, event);
    this.clearField(v);
    console.log(this.map.startLine)
    switch(this.chosenObject) {
      case ObjectType.START: {
        this.map.startLine.push(v);
        break;
      }
      case ObjectType.FINISH: {
        this.map.finishLine.push(v);

        break;
      }
      case ObjectType.OBSTACLE: {
        this.map.obstacles.push(v);
        break;
      }
      default: {
        //do nothing;
        break;
      }
    }
    this._mapService.map.next(this.map);
  }

  clearField(v: Vector){
    this.map.startLine = this.map.startLine.filter(vector => !vector.equals(v));
    this.map.finishLine = this.map.finishLine.filter(vector => !vector.equals(v));
    this.map.obstacles = this.map.obstacles.filter(vector => !vector.equals(v));
  }

  changeObjectType(type: ObjectType) {
    this.chosenObject = type;
  }
}
