import { User } from "./User";
import {RaceMap} from "./RaceMap";

export interface MapDto{
    raceMap : RaceMap;
    name: String;
    gamesPlayed : Number;
    rate : Number;
    author : User;
}
