import { Vector } from "../shared/models/Vector";
import {RaceMap} from "../shared/models/RaceMap";

export class MapResponse {

    mapId : number;
    name : string;
    width : number;
    height : number;
    userId : number;

    mapStructure : {
        finishLine : Vector[];
        startLine : Vector[];
        obstacles : Vector[];
    }
    rating : number;
    gamesPlayed: number;

  constructor(mapId: number, name: string, width: number, height: number, userId: number, mapStructure: { finishLine: Vector[]; startLine: Vector[]; obstacles: Vector[] }, rating: number, gamesPlayed: number) {
    this.mapId = mapId;
    this.name = name;
    this.width = width;
    this.height = height;
    this.userId = userId;
    this.mapStructure = mapStructure;
    this.rating = rating;
    this.gamesPlayed = gamesPlayed;
  }
}
