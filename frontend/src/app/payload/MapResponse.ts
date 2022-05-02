import { Vector } from "../shared/models/Vector";
import {RaceMap} from "../shared/models/RaceMap";

export interface MapResponse {

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
}
