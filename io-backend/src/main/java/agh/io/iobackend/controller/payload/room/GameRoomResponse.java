package agh.io.iobackend.controller.payload.room;

import lombok.Data;

@Data
public class GameRoomResponse {
    private Long roomId;
    private Long mapId;
    private int playersLimit;
    private int roundTime;
    private Long gameMasterId;
    private Boolean gameStarted; // ?
}
