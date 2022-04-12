package agh.io.iobackend.model;

import javax.persistence.*;

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

    @Column(
            name = "gameMasterID",
            nullable = false
    )
    private Long gameMasterID;

    @Column(
            name = "mapID"
    )
    // TODO mapID will be the foreign key for maps database, where details about the map are stored
    private Long mapID;

    @Column(
            name = "roomCode",
            unique = true,
            nullable = false
    )
    // Game code exchanged by players in order to join the play
    private String roomCode;

    @Column(
            name = "turnTime"
    )
    // Duration of each turn in seconds (for a player to make move)
    private Integer turnTime;

    @Column(
            name = "limitOfPlayers"
    )
    // Maximal number of players (apart from Game Master)
    private Integer limitOfPlayers;
}
