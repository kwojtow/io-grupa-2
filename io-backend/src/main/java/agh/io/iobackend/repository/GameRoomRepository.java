package agh.io.iobackend.repository;

import agh.io.iobackend.model.game.GameRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRoomRepository extends JpaRepository<GameRoom, Long> {
//    Optional<GameRoom> findByRoomCode(String code);
    Optional<GameRoom> findByGameRoomID(Long id);

}
