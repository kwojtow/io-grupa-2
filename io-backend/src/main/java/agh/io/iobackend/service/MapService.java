package agh.io.iobackend.service;

import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.repository.MapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MapService {

    @Autowired
    private MapRepository mapRepository;

    public GameMap saveMap(GameMap gameMap) {
        return mapRepository.save(gameMap);
    }

    public List<GameMap> getAllMaps() {
        return mapRepository.findAll();
    }

    public Optional<GameMap> getMapById(Long mapId) {
        return mapRepository.findById(mapId);
    }

    public List<GameMap> getMapsCreatedByUser(Long userId) {
        return mapRepository.findAll()
                .stream()
                .filter(x -> Objects.equals(x.getUserId(), userId))
                .collect(Collectors.toList());
    }

}
