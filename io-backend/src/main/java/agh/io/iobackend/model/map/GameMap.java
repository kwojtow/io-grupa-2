package agh.io.iobackend.model.map;

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

    private String name;

    private Integer width;

    private Integer height;

    // if created by specific User
    private Long userId;

    @Convert(converter = MapStructureConverter.class)
    private MapStructure mapStructure;

    @Transient
    private Double rating;

}