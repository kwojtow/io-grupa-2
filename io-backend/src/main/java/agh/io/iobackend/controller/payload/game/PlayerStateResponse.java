package agh.io.iobackend.controller.payload.game;

import agh.io.iobackend.model.Vector;
import agh.io.iobackend.model.player.PlayerStatus;
import lombok.Data;

@Data
public class PlayerStateResponse {
    private Long playerId;
    private int xCoordinate;
    private int yCoordinate;
    private Vector vector;
    private PlayerStatus playerStatus;
    private String color;
}