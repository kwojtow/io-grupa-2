package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.UserStatsResponse;
import agh.io.iobackend.service.StatisticsService;
import agh.io.iobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/statistics/")
@CrossOrigin
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private UserService userService;

    @GetMapping("/users-ranking")
    public void getUsersRanking() {
        // TODO
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserStatsResponse> getUserStats(@PathVariable Long userId) {
        long userWins = statisticsService.getUserWinsNumber(userId);
        long userGames = statisticsService.getUserGamesNumber(userId);
        return ResponseEntity.ok(new UserStatsResponse(userWins, userGames));
    }
}
