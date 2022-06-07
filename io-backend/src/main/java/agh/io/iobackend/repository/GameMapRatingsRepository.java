package agh.io.iobackend.repository;

import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.MapRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameMapRatingsRepository extends JpaRepository<MapRating, Long> {
    List<MapRating> findAllByMap(GameMap map);
    Boolean existsByMap(GameMap gameMap);
}
