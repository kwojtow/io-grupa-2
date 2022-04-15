package agh.io.iobackend.model.map;

import agh.io.iobackend.model.User;
import agh.io.iobackend.model.map.GameMap;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "game_map_history")
//@Proxy(lazy = false) // for tests
public class GameMapHistory {

    @Id
    @SequenceGenerator(
            name = "history_sequence",
            sequenceName = "history_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "history_sequence"
    )
    private Long historyId;

    @OneToOne
    @JoinColumn(
            name = "map_id",
            referencedColumnName = "map_id"
    )
    private GameMap map;

    @OneToOne
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "user_id"
    )
    private User user;

    private boolean win;

    // TODO consider adding more points when playing on challenging map and/or with experienced player
    private int points;

}
