package agh.io.iobackend.service;

import agh.io.iobackend.model.game.GameRoom;
import agh.io.iobackend.repository.GameRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RandomGameService {

    /*
    Current categories:
    0       for users with at most 0 points
    100     1 - 100
    250     101 - 250
    500     251 - 500
    1000    501 - 1000
    2500    1001 - 2500
    5000    2501 - 5000
    5000+   for users with more than 5000 points
     */


    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private MapService mapService;

    @Autowired
    private GameRoomRepository gameRoomRepository;

    @Autowired
    private UserService userService;


    private final Map<Long, GameRoom> rooms = new HashMap<>();


    private Long getCategory(int points) {
        if (points == 0) return 0L;
        if (points <= 100) return 100L;
        if (points <= 250) return 250L;
        if (points <= 500) return 500L;
        if (points <= 1000) return 1000L;
        if (points <= 2500) return 2500L;
        if (points <= 5000) return 5000L;
        return 1000000L;
    }


    public Long joinRandomRoom(Long userId) {

        int points = statisticsService.getUserRanks(userId).getPoints();
        Long category = getCategory(points);

        GameRoom gameRoom = rooms.get(category);
        boolean gameRoomAvailable = false;
        if (gameRoom != null) {
            gameRoomAvailable = !gameRoom.getGameStarted() && gameRoom.getUserList().size() < gameRoom.getLimitOfPlayers();
        }

        if (gameRoomAvailable) {
            rooms.get(category).addPlayer(userService.getUserById(userId).get());
            return gameRoom.getGameRoomID();
        }

        GameRoom newGameRoom = new GameRoom(mapService.getRandomMap(), 5, 10, userId);
        newGameRoom.addPlayer(userService.getUserById(userId).get());
        rooms.put(category, newGameRoom);
        return gameRoomRepository.save(newGameRoom).getGameRoomID();
    }
}
