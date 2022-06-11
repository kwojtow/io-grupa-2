package agh.io.iobackend.repository;

import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.GameMapHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameMapHistoryRepository extends JpaRepository<GameMapHistory, Long> {

    Boolean existsByMap(GameMap gameMap);
}
