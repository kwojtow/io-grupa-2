package agh.io.iobackend.controller.payload;

import agh.io.iobackend.model.PlayerStatus;
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