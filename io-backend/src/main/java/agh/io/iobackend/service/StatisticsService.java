package agh.io.iobackend.service;

import agh.io.iobackend.model.GameMapHistory;
import agh.io.iobackend.model.User;
import agh.io.iobackend.repository.GameMapHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.*;
import static java.util.Map.Entry.*;

@Service
public class StatisticsService {

    @Autowired
    private GameMapHistoryRepository gameMapHistoryRepository;

    public long getUserWinsNumber(Long userId) {
        return gameMapHistoryRepository.findAll().stream().filter(result -> result.getUser().getUserId().equals(userId) && result.isWin()).count();
    }

    public long getUserGamesNumber(Long userId) {
        return gameMapHistoryRepository.findAll().stream().filter(result -> result.getUser().getUserId().equals(userId)).count();
    }

    public LinkedHashMap<User, Integer> getUsersRanking() {
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
        return points.entrySet()
                .stream()
                .sorted(comparingByValue())
                .collect(
                        toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e2, LinkedHashMap::new));
    }
}
