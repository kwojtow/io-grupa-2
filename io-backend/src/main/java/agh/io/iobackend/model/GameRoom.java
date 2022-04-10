package agh.io.iobackend.model;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class GameRoom {
    private final int roomID;
    private User gameMaster;
    private Set<User> players = new HashSet<>();

    public GameRoom(User gameMaster) {
        this.roomID = 1;
        this.gameMaster = gameMaster;
    }

    public void addPlayer(User player) {
        players.add(player);
    }

    private long generateRoomID() {
        // TODO use UUID
        return 1;
    }
}
