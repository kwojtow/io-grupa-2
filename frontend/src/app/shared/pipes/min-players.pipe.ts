import { Pipe, PipeTransform } from '@angular/core';
import {MapDto} from "../models/MapDto";
import {map} from "rxjs";

@Pipe({
  name: 'minPlayers',
  pure: false
})
export class MinPlayersPipe implements PipeTransform {

  transform(maps: Array<MapDto>, minPlayers: number): MapDto[] {
    return maps.filter(map => this.getMapPlayersNumber(map) >= minPlayers);
  }

  private getMapPlayersNumber(map: MapDto){
    return map.raceMap.startLine.length;
  }

}
