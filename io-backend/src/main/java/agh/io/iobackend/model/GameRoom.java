package agh.io.iobackend.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Set;


@Entity
public class GameRoom {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    Long id;

    GameMap gameMap;

    GameMater gameMater;

    Set<Player> players;
}
