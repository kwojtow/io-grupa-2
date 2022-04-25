package agh.io.iobackend.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PlayerStatus {
    PLAYING, WAITING, LOST;

    @JsonCreator
    public static PlayerStatus fromString(String raw) {
        return PlayerStatus.valueOf(raw.toUpperCase());
    }
}