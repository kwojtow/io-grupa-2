package agh.io.iobackend.service;

import agh.io.iobackend.model.game.GameRoom;
import agh.io.iobackend.model.user.User;
import agh.io.iobackend.repository.GameRoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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

    -1      for users that don't want to wait for others in their category
     */


    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private MapService mapService;

    @Autowired
    private GameRoomRepository gameRoomRepository;

    @Autowired
    private UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(RandomGameService.class);

    private final Map<Long, Long> rooms = new HashMap<>(); // category -> roomId

    private final Map<Long, Long> joiningTimes = new HashMap<>(); // userId -> time; to store time when user joined random game

    private final Long defaultRoomCategory = -1L;

    private Long timeoutMilliseconds = 1000L * 30; // 30 seconds

    private int playersLimit = 3;

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

    public void setTimeoutMilliseconds(Long milliseconds) {
        this.timeoutMilliseconds = milliseconds;
    }

    public void setPlayersLimit(int playersLimit) {
        this.playersLimit = playersLimit;
    }

    public Long joinRandomRoom(Long userId) {

        joiningTimes.put(userId, new Date().getTime());

        int points = statisticsService.getUserRanks(userId).getPoints();
        Long category = getCategory(points);

        Long gameRoomId = rooms.get(category);

        // try to join existing room in a given category
        if (isGameRoomAvailable(gameRoomId)) {
            GameRoom gameRoom = gameRoomRepository.findByGameRoomID(gameRoomId).get();
            gameRoom.addPlayer(userService.getUserById(userId).get());
            gameRoomRepository.save(gameRoom);
            return gameRoom.getGameRoomID();
        }

        // crate new game room
        Long newGameRoomId = getNewGameRoom(userId);
        rooms.put(category, newGameRoomId);
        return newGameRoomId;
    }

    private boolean isGameRoomAvailable(Long gameRoomId) {
        Optional<GameRoom> gameRoomOpt = gameRoomRepository.findByGameRoomID(gameRoomId);
        if (gameRoomOpt.isPresent()) {
            GameRoom gameRoom = gameRoomOpt.get();
            return !gameRoom.getGameStarted() && gameRoom.getUserList().size() < gameRoom.getLimitOfPlayers();
        }
        return false;
    }

    private Long getNewGameRoom(Long userId) {
        GameRoom newGameRoom = new GameRoom(mapService.getRandomMap(playersLimit), playersLimit, 7, userId);
        newGameRoom.addPlayer(userService.getUserById(userId).get());
        newGameRoom.setRandom(true);
        return gameRoomRepository.save(newGameRoom).getGameRoomID();
    }

    public GameRoom joinAfterTimeout(User user) {

        // user did not join random game
        if (joiningTimes.get(user.getUserId()) == null) {
            return null;
        }

        // user is not waiting long enough
        if (joiningTimes.get(user.getUserId()) + timeoutMilliseconds > new Date().getTime()) {
            return null;
        }

        // check if user is not already in this room
        Long defaultGameRoomId = rooms.get(defaultRoomCategory);
        if (defaultGameRoomId != null) {
            Optional<GameRoom> defaultGameRoom = gameRoomRepository.findByGameRoomID(defaultGameRoomId);
            if (defaultGameRoom.isPresent() && defaultGameRoom.get().getUserList().contains(user) && !defaultGameRoom.get().getGameStarted()) {
                return null;
            }
        }

        // find where user is
        for (Long gameRoomId : rooms.values()) {
            GameRoom gameRoom = gameRoomRepository.findByGameRoomID(gameRoomId).get();
            if (gameRoom.getGameStarted()) {
                continue;
            }
            // gameMaster can not be transferred into default room
            if (gameRoom.getGameMasterID().equals(user.getUserId())) {
                return null;
            }
            if (gameRoom.getUserList().contains(user)) {
                gameRoom.removePlayer(user);
                gameRoomRepository.save(gameRoom);
                logger.info("User " + user.getUserId() + " is being deleted from game room with id: " + gameRoomId);
                break;
            }
        }

        // add user to the existing default room
        Optional<GameRoom> defaultGameRoom = gameRoomRepository.findByGameRoomID(defaultGameRoomId);
        if (isGameRoomAvailable(defaultGameRoomId)) {
            defaultGameRoom.get().addPlayer(user);
            gameRoomRepository.save(defaultGameRoom.get());
            return defaultGameRoom.get();
        }

        // create new game room
        Long newGameRoomId = getNewGameRoom(user.getUserId());
        logger.info("User " + user.getUserId() + " is joining default game room with id: " + newGameRoomId);
        rooms.put(defaultRoomCategory, newGameRoomId);
        return gameRoomRepository.getById(newGameRoomId);
    }

    public Long getRandomGameRoomId(User user) {
        Optional<GameRoom> gameRoomOpt = gameRoomRepository.findByGameRoomID(rooms.get(defaultRoomCategory));
        if (gameRoomOpt.isPresent()) {
            if (gameRoomOpt.get().getUserList().contains(user)) {
                return gameRoomOpt.get().getGameRoomID();
            }
        }
        return -1L;
    }

}
