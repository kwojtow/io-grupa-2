import { MapDto } from "./MapDto";
import { User } from "./User";

export interface GameRoomDto{
    id: number,
    mapDto : MapDto,
    playersLimit : number,
    roundTime: number,
    usersList : User[],
    owner : User
}