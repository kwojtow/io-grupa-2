package agh.io.iobackend.controller;

import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.service.MapService;
import agh.io.iobackend.service.StatisticsService;
import agh.io.iobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/user-wins")
    public void getMapsWithTheMostWinsForUser() {
        statisticsService.getMapsWithTheMostWinsForUser(userService.getCurrentUserId());
    }

    @GetMapping("/user-games")
    public void getMapsWithTheMostGamesForUser() {
        statisticsService.getMapsWithTheMostGamesForUser(userService.getCurrentUserId());
    }

    // TODO getMapRanking
}
