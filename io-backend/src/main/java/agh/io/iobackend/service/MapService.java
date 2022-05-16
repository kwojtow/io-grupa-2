package agh.io.iobackend.service;

import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.MapRating;
import agh.io.iobackend.model.user.User;
import agh.io.iobackend.repository.GameMapRatingsRepository;
import agh.io.iobackend.repository.MapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toMap;

@Service
public class MapService {

    @Autowired
    private MapRepository mapRepository;

    @Autowired
    private GameMapRatingsRepository gameMapRatingsRepository;

    @Autowired
    private StatisticsService statisticsService;

    public GameMap saveMap(GameMap gameMap) {
        return mapRepository.save(gameMap);
    }

    public GameMap updateMap(Long mapId, GameMap gameMap) {
        GameMap oldGameMap = mapRepository.findById(mapId).get();
        oldGameMap.setMapStructure(gameMap.getMapStructure());
        oldGameMap.setHeight(gameMap.getHeight());
        oldGameMap.setWidth(gameMap.getWidth());
        oldGameMap.setName(gameMap.getName());
        return mapRepository.save(oldGameMap);
    }

    public List<GameMap> getAllMaps() {
        List<GameMap> gameMaps = mapRepository.findAll();
        for (GameMap gameMap : gameMaps) {
            gameMap.setRating(getAverageRating(gameMap));
            gameMap.setGamesPlayed(statisticsService.getMapGamesPlayed(gameMap.getMapId()));
        }
        return gameMaps;
    }

    public void clearMaps() { // for tests
        mapRepository.deleteAll();
    }

    public void clearMapRatings() { // for tests
        gameMapRatingsRepository.deleteAll();
    }

    public GameMap getMapById(Long mapId) {
        Optional<GameMap> map = mapRepository.findById(mapId);
        if (map.isEmpty()) return null;
        else {
            GameMap gameMap = map.get();
            gameMap.setRating(getAverageRating(gameMap));
            gameMap.setGamesPlayed(statisticsService.getMapGamesPlayed(gameMap.getMapId()));
            return gameMap;
        }
    }

    public void removeMapById(Long mapId) {
        Optional<GameMap> gameMap = mapRepository.findById(mapId);
        gameMap.ifPresent(map -> mapRepository.delete(map));
    }

    public List<GameMap> getMapsCreatedByUser(Long userId) {
        return mapRepository.findAll()
                .stream()
                .filter(x -> Objects.equals(x.getUserId(), userId))
                .collect(Collectors.toList());
    }

    public void saveRating(GameMap map, User user, Integer rating) {
        List<MapRating> mapRatings = gameMapRatingsRepository.findAllByMap(map);
        List<MapRating> prevMapRating = mapRatings.stream().filter(mapRating -> mapRating.getUser().equals(user)).collect(Collectors.toList());
        if (prevMapRating.size() == 1) {
            gameMapRatingsRepository.delete(prevMapRating.get(0));
        }
        MapRating mapRating = MapRating.builder().map(map).user(user).rating(rating).build();
        gameMapRatingsRepository.save(mapRating);
    }

    public Double getAverageRating(GameMap map) {
        List<MapRating> mapRatings = gameMapRatingsRepository.findAllByMap(map);
        double avgRating = 0d;
        for (MapRating mapRating : mapRatings) {
            avgRating += mapRating.getRating().doubleValue();
        }
        if (mapRatings.size() == 0) return null;
        return avgRating / mapRatings.size();
    }

    public LinkedHashMap<GameMap, Double> getMapsRanking() {
        List<MapRating> mapRatings = gameMapRatingsRepository.findAll();
        Map<GameMap, Double> ratingsSum = new HashMap<>();
        Map<GameMap, Integer> ratingsNumber = new HashMap<>();
        for (MapRating mapRating : mapRatings) {
            GameMap map = mapRating.getMap();
            if (ratingsNumber.containsKey(map)) {
                Double currRatingsSum = ratingsSum.get(map);
                ratingsSum.put(map, currRatingsSum + mapRating.getRating());
                Integer currRatingsNum = ratingsNumber.get(map);
                ratingsNumber.put(map, currRatingsNum + 1);
            } else {
                ratingsSum.put(map, mapRating.getRating().doubleValue());
                ratingsNumber.put(map, 1);
            }
        }
        ratingsSum.replaceAll((k, v) -> v / ratingsNumber.get(k));
        return ratingsSum.entrySet()
                .stream()
                .sorted((c1, c2) -> -1 * c1.getValue().compareTo(c2.getValue()))
                .collect(
                        toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e2, LinkedHashMap::new));
    }
}