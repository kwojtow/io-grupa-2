package agh.io.iobackend.service;

import agh.io.iobackend.model.Vector;
import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.MapStructure;
import agh.io.iobackend.model.user.User;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
class MapServiceTest {

    @Autowired
    private MapService mapService;

    @Autowired
    private UserService userService;

    private static Long user1Id;
    private static Long user2Id;
    private static Long map1Id;
    private static Long map2Id;

    @BeforeAll
    static void prepareData(@Autowired MapService mapService, @Autowired StatisticsService statisticsService, @Autowired UserService userService,
                            @Autowired GameRoomService gameRoomService, @Autowired GameService gameService) {
        statisticsService.clearMapHistory();
        gameRoomService.clearGameRooms();
        gameService.clearGames();
        mapService.clearMapRatings();
        mapService.clearMaps();

        User user1 = User.builder().login("login1").email("email1").build();
        User user2 = User.builder().login("login2").email("email2").build();

        user1Id = userService.addUser(user1).getUserId();
        user2Id = userService.addUser(user2).getUserId();


        ArrayList<Vector> finishLine = new ArrayList<>();
        ArrayList<Vector> startLine = new ArrayList<>();
        ArrayList<Vector> obstacles = new ArrayList<>();
        finishLine.add(new Vector(1, 1));
        startLine.add(new Vector(2, 2));
        obstacles.add(new Vector(5, 5));

        MapStructure mapStructure = new MapStructure(finishLine, startLine, obstacles);

        GameMap gameMap1 = new GameMap();
        gameMap1.setName("super-map");
        gameMap1.setUserId(user1Id);
        gameMap1.setMapStructure(mapStructure);
        gameMap1.setWidth(10);
        gameMap1.setHeight(10);

        map1Id = mapService.saveMap(gameMap1).getMapId();

        GameMap gameMap2 = new GameMap();
        gameMap2.setName("super-map2");
        gameMap2.setUserId(user1Id);
        gameMap2.setMapStructure(mapStructure);
        gameMap2.setWidth(10);
        gameMap2.setHeight(10);

        map2Id = mapService.saveMap(gameMap2).getMapId();

    }

    @Test
    void averageRatingsAndRankingTest() {
        mapService.saveRating(mapService.getMapById(map1Id), userService.getUserById(user1Id).get(), 8);
        mapService.saveRating(mapService.getMapById(map1Id), userService.getUserById(user1Id).get(), 6);

        assertEquals(6.0, mapService.getAverageRating(mapService.getMapById(map1Id)));

        mapService.saveRating(mapService.getMapById(map1Id), userService.getUserById(user2Id).get(), 8);

        assertEquals(7.0, mapService.getAverageRating(mapService.getMapById(map1Id)));

        assertNull(mapService.getAverageRating(mapService.getMapById(map2Id)));

        mapService.saveRating(mapService.getMapById(map2Id), userService.getUserById(user1Id).get(), 5);
        mapService.saveRating(mapService.getMapById(map2Id), userService.getUserById(user2Id).get(), 3);

        LinkedHashMap<GameMap, Double> mapRanking = mapService.getMapsRanking();
        List<Double> ratings = List.of(7.0, 4.0);
        List<Long> mapIds = List.of(map1Id, map2Id);
        int it = 0;
        for(Map.Entry<GameMap, Double> entry: mapRanking.entrySet()) {
            assertEquals(mapIds.get(it), entry.getKey().getMapId());
            assertEquals(ratings.get(it), entry.getValue());
            it += 1;
        }
    }
}