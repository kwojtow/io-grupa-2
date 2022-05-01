package agh.io.iobackend.controller.payload.game;

import agh.io.iobackend.model.player.PlayerStatus;
import lombok.Data;

@Data
public class PlayerStateResponse {
    private Long playerId;
    private int xCoordinate;
    private int yCoordinate;
    private PlayerStatus playerStatus;
}