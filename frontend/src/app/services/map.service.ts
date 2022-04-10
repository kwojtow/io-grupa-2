import { Injectable } from '@angular/core';
import { MapDto } from '../shared/models/MapDto';
import { RaceMap } from '../shared/models/RaceMap';
import { Vector } from '../shared/models/Vector';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private userService : UserService) { }

  public getExampleMap(){
    const width = 13;
    const height = 10;
    return new RaceMap(width, height, [new Vector(1, 1), new Vector(2, 2)],
      [new Vector(3, 3), new Vector(4, 4)],
      [new Vector(7, 5), new Vector(8, 6)]);
  }

  public getExampleMapData() : MapDto{
    return {
      raceMap : this.getExampleMap(),
      name: "Mapa 1",
      gamesPlayed : 121,
      rate : 4.2,
      author : this.userService.getSomeUserMock()
    }
  }
}
