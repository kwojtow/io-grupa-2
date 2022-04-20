package agh.io.iobackend.model;

import agh.io.iobackend.model.map.GameMap;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "GameRoom")
public class GameRoom {

    @Id
    @SequenceGenerator(
            name = "gameRoom_sequence",
            sequenceName = "gameRoom_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "gameRoom_sequence"
    )
    @Column(
            name = "gameRoomID",
            updatable = false
    )
    private Long gameRoomID;

    @Column(name = "gameMasterID",
            nullable = false)
    private Long gameMasterID;

    @OneToOne
    private GameMap gameMap;

    @Column(name = "roundTime")
    // Duration of each turn in seconds (for a player to make move)
    private Integer roundTime;

    @Column(name = "limitOfPlayers")
    // Maximal number of players (apart from Game Master)
    private Integer limitOfPlayers;

    @Column(name = "gameStarted")
    // Maximal number of players (apart from Game Master)
    private Boolean gameStarted;

    @OneToMany
    private List<User> userList;

//    @ElementCollection
//    @Column(name = "gamesList")
//    private List<Long> gamesList; // kiedy bedzie wiecej gier w 1 pokoju

    public GameRoom(GameMap map, int playersLimit, int roundTime, Long gameMasterId) {
        this.gameMap = map;
        this.limitOfPlayers = playersLimit;
        this.roundTime = roundTime;
        this.gameMasterID = gameMasterId;
        this.userList = new ArrayList<>();
    }

    public GameRoom() {

    }

    public void removePlayer(User user) {
        userList.remove(user);
    }

    public void addPlayer(User user) {
        userList.add(user);
    }

    public Long getGameRoomID() {
        return gameRoomID;
    }

    public Long getGameMasterID() {
        return gameMasterID;
    }

    public Integer getLimitOfPlayers() {
        return limitOfPlayers;
    }

    public Integer getRoundTime() {
        return roundTime;
    }

    public Boolean getGameStarted() {
        return this.gameStarted;
    }

    public void setGameStarted(Boolean gameStarted) {
        this.gameStarted = gameStarted;
    }

    public GameMap getGameMap() {
        return gameMap;
    }

    public List<User> getUserList() {
        return userList;
    }
}
