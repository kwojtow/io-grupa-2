package agh.io.iobackend.controller.payload.game;

import agh.io.iobackend.model.player.PlayerStatus;
import agh.io.iobackend.model.Vector;
import lombok.Data;

@Data
public class PlayerMoveRequest {
    private Long playerId;
    private int xCoordinate;
    private int yCoordinate;
    private Vector vector;
    private PlayerStatus playerStatus;
}