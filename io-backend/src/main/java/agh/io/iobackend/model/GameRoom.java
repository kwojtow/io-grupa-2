package agh.io.iobackend.model;

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

    @Column(name = "mapID")
    // TODO mapID will be the foreign key for maps database, where details about the map are stored
    private Long mapID;

    @Column(name = "roundTime")
    // Duration of each turn in seconds (for a player to make move)
    private Integer roundTime;

    @Column(name = "limitOfPlayers")
    // Maximal number of players (apart from Game Master)
    private Integer limitOfPlayers;

    @ElementCollection
    @Column(name = "userList")
    private List<Long> userList;

//    @ElementCollection
//    @Column(name = "gamesList")
//    private List<Long> gamesList; // kiedy bedzie wiecej gier w 1 pokoju

    public GameRoom(Long mapId, int playersLimit, int roundTime, Long gameMasterId) {
        this.mapID = mapId;
        this.limitOfPlayers = playersLimit;
        this.roundTime = roundTime;
        this.gameMasterID = gameMasterId;
    }

    public GameRoom() {

    }

    public void removePlayer(Long userId){
        this.userList.remove(userId);
    }

    public void addPlayer(Long userId){
        this.userList.add(userId);
    }

    public Long getGameRoomID(){
        return getGameRoomID();
    }

    public Long getGameMasterID(){
        return gameMasterID;
    }

    public Integer getLimitOfPlayers() {
        return limitOfPlayers;
    }

    public Integer getRoundTime() {
        return roundTime;
    }

    public Long getMapID() {
        return mapID;
    }

    public List<Long> getUserList(){
        return this.userList;
    }
}
