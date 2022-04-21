package agh.io.iobackend.model;

import javax.persistence.*;

@Entity(name = "Game")
public class Game {

    @Id
    @SequenceGenerator(
            name = "game_sequence",
            sequenceName = "game_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "game_sequence"
    )
    @Column(
            name = "gameId",
            updatable = false
    )
    private Long gameId;

    @Column(name = "gameRoomId")
    private Long gameRoomId;
    @Column(name = "mapId")
    private Long mapId;
    @Column(name = "gameMasterId")
    private Long gameMasterId;

    public Game(Long roomId, Long mapId, Long gameMasterId){
        this.gameRoomId = roomId;
        this.mapId = mapId;
        this.gameMasterId = gameMasterId;
    }

    public Game(){

    }


}
