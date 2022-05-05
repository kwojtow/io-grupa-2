package agh.io.iobackend.controller;

import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.service.MapService;
import agh.io.iobackend.service.StatisticsService;
import agh.io.iobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/map")
@CrossOrigin
public class MapController {

    @Autowired
    private MapService mapService;

    @Autowired
    private UserService userService;

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/list")
    public ResponseEntity<List<GameMap>> getMaps() {
        return ResponseEntity.ok(mapService.getAllMaps());
    }

    @GetMapping
    public ResponseEntity<List<GameMap>> getMaps(@RequestParam Long authorId) {
        return ResponseEntity.ok(mapService.getMapsCreatedByUser(authorId));
    }

    @CrossOrigin
    @GetMapping("/{mapId}")
    public ResponseEntity<GameMap> getMapById(@PathVariable Long mapId) {
        Optional<GameMap> map = mapService.getMapById(mapId);
        if (map.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(map.get());
    }

    @PostMapping
    public ResponseEntity<Long> saveMap(@RequestBody GameMap gameMap) {
        GameMap map = mapService.saveMap(gameMap);
        return ResponseEntity.ok(map.getMapId());
    }

    @PostMapping("/{mapId}")
    public ResponseEntity<GameMap> updateMap(@PathVariable Long mapId, @RequestBody GameMap gameMap) {
        return ResponseEntity.ok().body(mapService.updateMap(mapId, gameMap));
    }

    @CrossOrigin
    @DeleteMapping("/{mapId}")
    public ResponseEntity<String> removeMapById(@PathVariable Long mapId) {
        mapService.removeMapById(mapId);
        return ResponseEntity.ok().body("Map deleted");
    }

    @GetMapping("/user-wins")
    public void getMapsWithTheMostWinsForUser() {
        statisticsService.getMapsWithTheMostWinsForUser(userService.getCurrentUserId());
    }

    @GetMapping("/user-games")
    public void getMapsWithTheMostGamesForUser() {
        statisticsService.getMapsWithTheMostGamesForUser(userService.getCurrentUserId());
    }

    @PostMapping("/rating/{mapId}")
    public ResponseEntity<String> saveMapRating(@PathVariable Long mapId, @RequestParam Integer rating) {
        mapService.saveRating(mapService.getMapById(mapId).get(), userService.getCurrentUser(), rating);
        return ResponseEntity.ok().body("Rating added successfully");
    }

    @GetMapping("/ranking")
    public ResponseEntity<LinkedHashMap<GameMap, Double>> getMapRanking() {
        return ResponseEntity.ok().body(mapService.getMapsRanking());
    }
}
