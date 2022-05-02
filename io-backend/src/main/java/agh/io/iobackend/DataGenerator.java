package agh.io.iobackend;

import agh.io.iobackend.controller.AuthController;
import agh.io.iobackend.controller.MapController;
import agh.io.iobackend.controller.payload.auth.SignupRequest;
import agh.io.iobackend.model.Vector;
import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.MapStructure;
import agh.io.iobackend.service.StatisticsService;
import agh.io.iobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;

/*
This class is responsible for generating example data.
 */
//@Component // <- comment out if you want to generate some data during application startup
public class DataGenerator {

    @Autowired
    private MapController mapController;

    @Autowired
    private AuthController authController;

    @Autowired
    private UserService userService;

    @Autowired
    private StatisticsService statisticsService;

    private final String username1 = "great-user1";
    private final String email1 = "greatemail1@gmail.com";
    private final String username2 = "great-user2";
    private final String email2 = "greatemail2@gmail.com";
    private final String password = "pass";
    private Long user1Id;
    private Long user2Id;
    private Long map1Id;
    private Long map2Id;

    @PostConstruct
    private void generateInitialData() {
        addUsers();
        addMaps(user1Id);
        addGameMapHistory();
    }

    private void addUsers() {
        // user1
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername(username1);
        signupRequest.setEmail(email1);
        signupRequest.setPassword(password);

        authController.registerUser(signupRequest);
        user1Id = userService.getUserByLogin(username1).get().getUserId();

        // user 2
        signupRequest = new SignupRequest();
        signupRequest.setUsername(username2);
        signupRequest.setEmail(email2);
        signupRequest.setPassword(password);

        authController.registerUser(signupRequest);
        user2Id = userService.getUserByLogin(username2).get().getUserId();
    }

    private void addMaps(Long userId) {
        // map 1
        ArrayList<Vector> finishLine = new ArrayList<>();
        ArrayList<Vector> startLine = new ArrayList<>();
        ArrayList<Vector> obstacles = new ArrayList<>();
        finishLine.add(new Vector(1, 1));
        startLine.add(new Vector(2, 2));
        obstacles.add(new Vector(5, 5));

        MapStructure mapStructure = new MapStructure(finishLine, startLine, obstacles);

        GameMap gameMap = new GameMap();
        gameMap.setName("super-map");
        gameMap.setUserId(userId);
        gameMap.setMapStructure(mapStructure);
        gameMap.setWidth(10);
        gameMap.setHeight(10);

        map1Id = mapController.saveMap(gameMap).getBody();

        // map 2
        finishLine = new ArrayList<>();
        startLine = new ArrayList<>();
        obstacles = new ArrayList<>();
        finishLine.add(new Vector(1, 3));
        startLine.add(new Vector(2, 3));
        obstacles.add(new Vector(5, 3));

        mapStructure = new MapStructure(finishLine, startLine, obstacles);

        gameMap = new GameMap();
        gameMap.setName("super-map");
        gameMap.setUserId(userId);
        gameMap.setMapStructure(mapStructure);
        gameMap.setWidth(10);
        gameMap.setHeight(10);

        map2Id = mapController.saveMap(gameMap).getBody();
    }

    private void addGameMapHistory() {
        statisticsService.saveHistoryEntry(mapController.getMapById(map1Id).getBody(), userService.getUserById(user1Id).get(), true, 10);
        statisticsService.saveHistoryEntry(mapController.getMapById(map1Id).getBody(), userService.getUserById(user2Id).get(), false, 0);
        statisticsService.saveHistoryEntry(mapController.getMapById(map2Id).getBody(), userService.getUserById(user1Id).get(), false, 5);
        statisticsService.saveHistoryEntry(mapController.getMapById(map2Id).getBody(), userService.getUserById(user2Id).get(), true, 20);
    }
}
