package agh.io.iobackend.controller.payload;

import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.user.User;
import lombok.Data;

import java.util.Map;

@Data
public class MapRankEntry {
    private GameMap gameMap;
    private Double score;

    public MapRankEntry(User key, Integer value) {
    }

    public MapRankEntry(Map.Entry<GameMap, Double> entry) {
        this.gameMap = entry.getKey();
        this.score = entry.getValue();
    }
}