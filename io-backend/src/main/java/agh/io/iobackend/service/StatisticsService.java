package agh.io.iobackend.service;

import agh.io.iobackend.controller.payload.stats.UserRankResponse;
import agh.io.iobackend.model.user.User;
import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.GameMapHistory;
import agh.io.iobackend.repository.GameMapHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toMap;

@Service
public class StatisticsService {

    private static final Logger logger = LoggerFactory.getLogger(StatisticsService.class);

    @Autowired
    private GameMapHistoryRepository gameMapHistoryRepository;

    @Autowired
    private UserService userService;

    public void saveHistoryEntry(GameMap map, User user, boolean win, int points) {
        logger.info("saveHistoryEntry");
        GameMapHistory gameMapHistory = GameMapHistory
                .builder()
                .map(map)
                .user(user)
                .win(win)
                .points(points)
                .build();
        gameMapHistoryRepository.save(gameMapHistory);
    }

    public void clearMapHistory() { // for tests
        gameMapHistoryRepository.deleteAll();
    }

    public long getUserWinsNumber(Long userId) {
        logger.info("getUserWinsNumber");
        return gameMapHistoryRepository.findAll().stream().filter(result -> result.getUser().getUserId().equals(userId) && result.isWin()).count();
    }

    public long getUserGamesNumber(Long userId) {
        logger.info("getUserGamesNumber");
        return gameMapHistoryRepository.findAll().stream().filter(result -> result.getUser().getUserId().equals(userId)).count();
    }

    public long getMapGamesPlayed(Long mapId) {
        logger.info("getMapGamesPlayed");
        return gameMapHistoryRepository.findAll().stream().filter(result -> result.getMap().getMapId().equals(mapId)).count();
    }

    public LinkedHashMap<User, Integer> getUsersRanking() {
        logger.info("getUsersRanking");
        List<GameMapHistory> gameMapHistories = gameMapHistoryRepository.findAll();
        Map<User, Integer> points = new HashMap<>();
        for (GameMapHistory gameMapHistory : gameMapHistories) {
            User user = gameMapHistory.getUser();
            if (points.containsKey(user)) {
                int p = points.get(user);
                points.put(user, p + gameMapHistory.getPoints());
            } else {
                points.put(user, gameMapHistory.getPoints());
            }
        }
        List<User> usersList = userService.getAllUsers();
        for (User user : usersList) {
            if (!points.containsKey(user)) {
                points.put(user, 0);
            }
        }

        return points.entrySet()
                .stream()
                .sorted((c1, c2) -> -1 * c1.getValue().compareTo(c2.getValue()))
                .collect(
                        toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e2, LinkedHashMap::new));
    }

    public UserRankResponse getUserRanks(Long userId) {
        LinkedHashMap<User, Integer> userRanking = getUsersRanking();
        int currentPosition = 1;
        for (Map.Entry<User, Integer> entry : userRanking.entrySet()) {
            if (entry.getKey().getUserId().equals(userId)) {
                return new UserRankResponse(currentPosition, entry.getValue());
            }
            currentPosition += 1;
        }
        return null;
    }

    public LinkedHashMap<GameMap, Integer> getMapsWithTheMostWinsForUser(Long userId) {
        List<GameMapHistory> gameMapHistories = gameMapHistoryRepository.findAll();
        Map<GameMap, Integer> wins = new HashMap<>();
        for (GameMapHistory gameMapHistory : gameMapHistories) {
            if (!gameMapHistory.getUser().getUserId().equals(userId) || !gameMapHistory.isWin()) {
                continue;
            }
            GameMap gameMap = gameMapHistory.getMap();
            if (wins.containsKey(gameMap)) {
                int p = wins.get(gameMap);
                wins.put(gameMap, p + 1);
            } else {
                wins.put(gameMap, 1);
            }
        }
        return wins.entrySet()
                .stream()
                .sorted((c1, c2) -> -1 * c1.getValue().compareTo(c2.getValue()))
                .collect(
                        toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e2, LinkedHashMap::new));
    }

    public LinkedHashMap<GameMap, Integer> getMapsWithTheMostGamesForUser(Long userId) {
        List<GameMapHistory> gameMapHistories = gameMapHistoryRepository.findAll();
        Map<GameMap, Integer> games = new HashMap<>();
        for (GameMapHistory gameMapHistory : gameMapHistories) {
            if (!gameMapHistory.getUser().getUserId().equals(userId)) {
                continue;
            }
            GameMap gameMap = gameMapHistory.getMap();
            if (games.containsKey(gameMap)) {
                int p = games.get(gameMap);
                games.put(gameMap, p + 1);
            } else {
                games.put(gameMap, 1);
            }
        }
        return games.entrySet()
                .stream()
                .sorted((c1, c2) -> -1 * c1.getValue().compareTo(c2.getValue()))
                .collect(
                        toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e2, LinkedHashMap::new));
    }
}