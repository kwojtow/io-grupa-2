package agh.io.iobackend.controller.payload;

import agh.io.iobackend.model.User;
import lombok.Data;

import java.util.Map;

@Data
public class RankEntry {
    private User user;
    private Integer position;

    public RankEntry(User key, Integer value) {
    }

    public RankEntry(Map.Entry<User, Integer> entry) {
        this.user = entry.getKey();
        this.position = entry.getValue();
    }
}
