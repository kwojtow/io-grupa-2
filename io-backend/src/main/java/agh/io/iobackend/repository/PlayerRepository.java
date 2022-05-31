package agh.io.iobackend.repository;

import agh.io.iobackend.model.player.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
public interface PlayerRepository extends JpaRepository<Player, Long> {
}
