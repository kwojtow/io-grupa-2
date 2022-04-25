import { Vector } from "../shared/models/Vector";

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