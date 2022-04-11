package agh.io.iobackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "maps")
@Builder
public class GameMap {

    @Id
    @SequenceGenerator(
            name = "map_sequence",
            sequenceName = "map_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "map_sequence"
    )
    @Column(name = "map_id")
    private Long mapId;

    // if created by specific User
    private Long userId;

    // TODO other map information

}
