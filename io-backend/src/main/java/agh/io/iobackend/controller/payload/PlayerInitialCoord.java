package agh.io.iobackend.controller.payload;

import lombok.Data;

@Data
public class PlayerInitialCoord {

    private Long userId;
    private int xCoord;
    private int yCoord;
}
