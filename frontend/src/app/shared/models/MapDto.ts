import { User } from "./User";

export interface MapDto{
    raceMap : Object;
    name: String;
    gamesPlayed : Number;
    rate : Number;
    author : User;
}