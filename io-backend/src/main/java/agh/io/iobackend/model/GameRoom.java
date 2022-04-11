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
    private Long mapID;

    @Column(
            name = "roomCode",
            unique = true,
            nullable = false
    )
    private String roomCode;
}
