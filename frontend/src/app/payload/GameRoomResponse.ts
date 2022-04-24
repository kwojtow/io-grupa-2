export interface GameRoomResponse {
    roomId : number;
    mapId : number;
    playersLimit : number;
    roundTime : number;
    gameMasterId : number;
    gameStarted : boolean;
}