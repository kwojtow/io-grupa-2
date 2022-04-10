package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.MoveRequest;
import agh.io.iobackend.model.GameState;
import agh.io.iobackend.model.Player;
import agh.io.iobackend.service.GameService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class GameControllerTest {

    @Autowired
    private GameController gameController;

    @Autowired
    private GameService gameService;

    @Test
    void changeVectorAndMoveTest() {
        GameState gameState = new GameState();
        gameState.addPlayerToGame(1L, new Player(5,5, 1L));
        gameService.addGame(1L, gameState);

        MoveRequest moveRequest = new MoveRequest();
        moveRequest.setGameId(1L);
        moveRequest.setPlayerId(1L);
        moveRequest.setXChange(-1);
        moveRequest.setYChange(1);

        ResponseEntity<Pair<Integer, Integer>> changePositionResponse = gameController.changePosition(moveRequest);
        assertEquals(changePositionResponse.getStatusCodeValue(), 200);
        assertEquals(gameState.getPlayer(1L).getPlayerState().getPlayerPosition(), Pair.of(4,6));

        MoveRequest noGameMoveRequest = new MoveRequest();
        noGameMoveRequest.setGameId(4L);
        noGameMoveRequest.setPlayerId(1L);
        noGameMoveRequest.setXChange(-1);
        noGameMoveRequest.setYChange(1);

        ResponseEntity<Pair<Integer, Integer>>  noGameChangePosition = gameController.changePosition(noGameMoveRequest);
        assertEquals(noGameChangePosition.getStatusCodeValue(), 400);
        assertEquals(gameState.getPlayer(1L).getPlayerState().getPlayerPosition(), Pair.of(4,6));

    }


}
