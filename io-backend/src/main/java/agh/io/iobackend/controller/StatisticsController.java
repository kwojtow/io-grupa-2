package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.stats.UserStatsResponse;
import agh.io.iobackend.controller.payload.RankEntry;
import agh.io.iobackend.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/statistics/")
@CrossOrigin
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/users-ranking")
    public ResponseEntity<List<RankEntry>> getUsersRanking() {

        return ResponseEntity.ok(
                statisticsService
                        .getUsersRanking()
                        .entrySet()
                        .stream()
                        .map(RankEntry::new)
                        .collect(Collectors.toList()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserStatsResponse> getUserStats(@PathVariable Long userId) {
        long userWins = statisticsService.getUserWinsNumber(userId);
        long userGames = statisticsService.getUserGamesNumber(userId);
        return ResponseEntity.ok(new UserStatsResponse(userWins, userGames));
    }
}