package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.stats.UserStatsResponse;
import agh.io.iobackend.model.user.User;
import agh.io.iobackend.service.StatisticsService;
import agh.io.iobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;

@RestController
@RequestMapping("/statistics/")
@CrossOrigin
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/users-ranking")
    public ResponseEntity<LinkedHashMap<User, Integer>> getUsersRanking() {
        return ResponseEntity.ok(statisticsService.getUsersRanking());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserStatsResponse> getUserStats(@PathVariable Long userId) {
        long userWins = statisticsService.getUserWinsNumber(userId);
        long userGames = statisticsService.getUserGamesNumber(userId);
        return ResponseEntity.ok(new UserStatsResponse(userWins, userGames));
    }
}
