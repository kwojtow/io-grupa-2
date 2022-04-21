package agh.io.iobackend.repository;

import agh.io.iobackend.model.map.GameMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MapRepository extends JpaRepository<GameMap, Long> {

}
