package agh.io.iobackend.service;

import agh.io.iobackend.controller.payload.UserRankResponse;
import agh.io.iobackend.model.User;
import agh.io.iobackend.model.map.GameMap;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.LinkedHashMap;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class StatisticsServiceTest {

    @Autowired
    private StatisticsService statisticsService;

    private static User user1;
    private static User user2;
    private static User user3;

    private static GameMap gameMap1;
    private static GameMap gameMap2;

    @BeforeAll
    public static void prepareData(@Autowired UserService userService, @Autowired MapService mapService, @Autowired StatisticsService statisticsService) {
        System.out.println("prepring data");
        user1 = User
                .builder()
                .email("user1@gmail.com")
                .login("user1")
                .password("pass1")
                .build();

        user2 = User
                .builder()
                .email("user2@gmail.com")
                .login("user2")
                .password("pass2")
                .build();


        user3 = User
                .builder()
                .email("user3@gmail.com")
                .login("user3")
                .password("pass3")
                .build();

        userService.addUser(user1);
        userService.addUser(user2);
        userService.addUser(user3);

        gameMap1 = GameMap
                .builder()
                .userId(user1.getUserId())
                .build();

        gameMap2 = GameMap
                .builder()
                .userId(user2.getUserId())
                .build();

        mapService.saveMap(gameMap1);
        mapService.saveMap(gameMap2);

        statisticsService.saveHistoryEntry(gameMap1, user1, true, 10);
        statisticsService.saveHistoryEntry(gameMap1, user2, false, 0);
        statisticsService.saveHistoryEntry(gameMap1, user3, false, 0);

        statisticsService.saveHistoryEntry(gameMap1, user1, false, 0);
        statisticsService.saveHistoryEntry(gameMap1, user2, false, 0);
        statisticsService.saveHistoryEntry(gameMap1, user3, true, 15);

        statisticsService.saveHistoryEntry(gameMap2, user1, true, 20);
        statisticsService.saveHistoryEntry(gameMap2, user2, false, -5);
        statisticsService.saveHistoryEntry(gameMap2, user3, false, 0);
    }

    @Test
    void userWinsNumberTest() {
        assertEquals(2, statisticsService.getUserWinsNumber(user1.getUserId()));
        assertEquals(0, statisticsService.getUserWinsNumber(user2.getUserId()));
        assertEquals(1, statisticsService.getUserWinsNumber(user3.getUserId()));
    }

    @Test
    void userGamesNumberTest() {
        assertEquals(3, statisticsService.getUserGamesNumber(user1.getUserId()));
        assertEquals(3, statisticsService.getUserGamesNumber(user2.getUserId()));
        assertEquals(3, statisticsService.getUserGamesNumber(user2.getUserId()));
    }

    @Test
    void usersRankingTest() {
        LinkedHashMap<User, Integer> usersRanking = statisticsService.getUsersRanking();
        assertEquals(30, usersRanking.get(user1));
        assertEquals(-5, usersRanking.get(user2));
        assertEquals(15, usersRanking.get(user3));
    }

    @Test
    void userRanksTest() {
        UserRankResponse userRankResponse1 = statisticsService.getUserRanks(user1.getUserId());
        assertEquals(1, userRankResponse1.getRankingPosition());
        assertEquals(30, userRankResponse1.getPoints());

        UserRankResponse userRankResponse2 = statisticsService.getUserRanks(user2.getUserId());
        assertEquals(3, userRankResponse2.getRankingPosition());
        assertEquals(-5, userRankResponse2.getPoints());

        UserRankResponse userRankResponse3 = statisticsService.getUserRanks(user3.getUserId());
        assertEquals(2, userRankResponse3.getRankingPosition());
        assertEquals(15, userRankResponse3.getPoints());
    }

    @Test
    void mapsWithTheMostWinsForUserTest() {
        LinkedHashMap<GameMap, Integer> mapWins1 = statisticsService.getMapsWithTheMostWinsForUser(user1.getUserId());
        assertEquals(1, mapWins1.get(gameMap1));
        assertEquals(1, mapWins1.get(gameMap2));

        LinkedHashMap<GameMap, Integer> mapWins2 = statisticsService.getMapsWithTheMostWinsForUser(user2.getUserId());
        assertEquals(null, mapWins2.get(gameMap1));
        assertEquals(null, mapWins2.get(gameMap2));

        LinkedHashMap<GameMap, Integer> mapWins3 = statisticsService.getMapsWithTheMostWinsForUser(user3.getUserId());
        assertEquals(1, mapWins3.get(gameMap1));
        assertEquals(null, mapWins3.get(gameMap2));
    }

    @Test
    void mapsWithTheMostGamesForUserTest() {
        LinkedHashMap<GameMap, Integer> mapGames1 = statisticsService.getMapsWithTheMostGamesForUser(user1.getUserId());
        assertEquals(2, mapGames1.get(gameMap1));
        assertEquals(1, mapGames1.get(gameMap2));

        LinkedHashMap<GameMap, Integer> mapGames2 = statisticsService.getMapsWithTheMostGamesForUser(user2.getUserId());
        assertEquals(2, mapGames2.get(gameMap1));
        assertEquals(1, mapGames2.get(gameMap2));

        LinkedHashMap<GameMap, Integer> mapGames3 = statisticsService.getMapsWithTheMostGamesForUser(user3.getUserId());
        assertEquals(2, mapGames3.get(gameMap1));
        assertEquals(1, mapGames3.get(gameMap2));
    }
}