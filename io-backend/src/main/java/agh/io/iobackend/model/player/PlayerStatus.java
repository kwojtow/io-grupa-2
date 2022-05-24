package agh.io.iobackend.model.player;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PlayerStatus {
    PLAYING, WAITING, LOST;

    @JsonCreator
    public static PlayerStatus fromString(String raw) {
        return PlayerStatus.valueOf(raw.toUpperCase());
    }
}