package agh.io.iobackend.controller.payload;

import agh.io.iobackend.model.map.GameMap;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MapResponse {

    private GameMap map;

    private int games;

}