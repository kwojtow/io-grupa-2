package agh.io.iobackend.service;

import agh.io.iobackend.model.Vector;
import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.MapStructure;
import agh.io.iobackend.model.user.User;
import agh.io.iobackend.repository.GameRoomRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class RandomGameServiceTest {

    @Autowired
    private GameRoomRepository gameRoomRepository;

    @Autowired
    private RandomGameService randomGameService;

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
    void joinRandomGame() {
        Long roomId = randomGameService.joinRandomRoom(user1Id);
        assertEquals(1, gameRoomRepository.findByGameRoomID(roomId).get().getUserList().size());
        roomId = randomGameService.joinRandomRoom(user2Id);
        assertEquals(2, gameRoomRepository.findByGameRoomID(roomId).get().getUserList().size());

        randomGameService.setTimeoutMilliseconds(0L);

        randomGameService.joinAfterTimeout(userService.getUserById(user1Id).get());
        assertEquals(2, gameRoomRepository.findByGameRoomID(roomId).get().getUserList().size());

        randomGameService.joinAfterTimeout(userService.getUserById(user2Id).get());
        assertEquals(1, gameRoomRepository.findByGameRoomID(roomId).get().getUserList().size());

        Long defaultRoomId = randomGameService.getRandomGameRoomId(userService.getUserById(user2Id).get());
        assertEquals(1, gameRoomRepository.findByGameRoomID(defaultRoomId).get().getUserList().size());
    }

}