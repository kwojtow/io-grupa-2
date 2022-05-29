package agh.io.iobackend.repository;

import agh.io.iobackend.model.game.GameRoom;
import agh.io.iobackend.model.map.GameMap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRoomRepository extends JpaRepository<GameRoom, Long> {
    Optional<GameRoom> findByGameRoomID(Long id);

    Boolean existsByGameMap(GameMap gameMap);
}
