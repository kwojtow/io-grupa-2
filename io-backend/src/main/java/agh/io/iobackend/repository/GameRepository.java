package agh.io.iobackend.repository;

import agh.io.iobackend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {
    Optional<Game> findByGameId(Long id);
}
