package agh.io.iobackend.model.map;

import agh.io.iobackend.model.user.User;
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
@Table(name = "game_map_ratings")
public class MapRating {
    @Id
    @SequenceGenerator(
            name = "ratings_sequence",
            sequenceName = "ratings_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "ratings_sequence"
    )
    private Long ratingId;

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

    private Integer rating;
}
