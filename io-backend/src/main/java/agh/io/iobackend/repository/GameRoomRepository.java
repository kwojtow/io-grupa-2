package agh.io.iobackend.repository;

import agh.io.iobackend.model.game.Game;
import agh.io.iobackend.model.game.GameRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRoomRepository extends JpaRepository<GameRoom, Long> {
    Optional<GameRoom> findByGameRoomID(Long id);
}
