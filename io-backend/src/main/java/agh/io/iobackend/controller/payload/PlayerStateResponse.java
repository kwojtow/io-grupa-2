package agh.io.iobackend.controller.payload;

import agh.io.iobackend.model.PlayerStatus;
import lombok.Data;

@Data
public class PlayerStateResponse {

    private Long playerId;

    private int xCoordinate;

    private int yCoordinate;

    private PlayerStatus playerStatus;

}