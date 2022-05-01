package agh.io.iobackend.model.game;

import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.user.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
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
    private Boolean gameStarted;

    @OneToMany
    private List<User> userList;

    @OneToOne
    private Game game;

    public GameRoom(GameMap map, int playersLimit, int roundTime, Long gameMasterId) {
        this.gameMap = map;
        this.limitOfPlayers = playersLimit;
        this.roundTime = roundTime;
        this.gameMasterID = gameMasterId;
        this.userList = new ArrayList<>();
    }

    public void removePlayer(User user) {
        userList.remove(user);
    }

    public void addPlayer(User user) {
        userList.add(user);
    }

}
