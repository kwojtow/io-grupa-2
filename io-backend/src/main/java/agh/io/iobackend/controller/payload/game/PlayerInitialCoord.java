package agh.io.iobackend.controller.payload.game;

import lombok.Data;

@Data
public class PlayerInitialCoord {

    private Long userId;
    private int xCoord;
    private int yCoord;
}
