package agh.io.iobackend.service;

import agh.io.iobackend.model.GameMap;
import agh.io.iobackend.repository.MapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MapService {

    @Autowired
    private MapRepository mapRepository;

    public List<GameMap> getMapsCreatedByUser(Long userId){
        return mapRepository.findAll()
                .stream()
                .filter(x -> Objects.equals(x.getUserId(), userId))
                .collect(Collectors.toList());
    }
}
