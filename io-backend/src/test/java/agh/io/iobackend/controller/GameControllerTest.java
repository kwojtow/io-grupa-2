
package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.PlayerStateResponse;
import agh.io.iobackend.model.GameState;
import agh.io.iobackend.model.Player;
import agh.io.iobackend.model.PlayerStatus;
import agh.io.iobackend.model.Vector;
import agh.io.iobackend.service.GameService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class GameControllerTest {

    @Autowired
    private GameController gameController;

    @Autowired
    private GameService gameService;

    @Test
    void changeGameStateAfterMoveAndUpdatePlayerTurn() {
        //given
        GameState gameState = new GameState();
        gameState.addPlayerToGame(1L, new Player(5, 5, 1L));
        gameState.addPlayerToGame(2L, new Player(6, 6, 2L));
        gameService.addGame(1L, gameState);

        PlayerMoveRequest playerMoveRequest = new PlayerMoveRequest();

        playerMoveRequest.setPlayerId(1L);
        playerMoveRequest.setVector(new Vector(-1, 1));
        playerMoveRequest.setXCoordinate(4);
        playerMoveRequest.setYCoordinate(5);
        playerMoveRequest.setPlayerStatus(PlayerStatus.WAITING);

        //when
        ResponseEntity<String> changePositionResponse = gameController.changePosition(playerMoveRequest, 1L);
        ResponseEntity<ArrayList<PlayerStateResponse>> playerStateResponse = gameController.getGameState(1L);

        //then
        assertEquals(changePositionResponse.getStatusCodeValue(), 200);
        assertEquals(gameState.getPlayer(1L).getPlayerState().getPlayerPosition(), Pair.of(4, 5));
        assertEquals(gameState.getCurrentPlayerId(), 2L);
        assertEquals(gameState.getPlayer(1L).getPlayerStatus(), PlayerStatus.WAITING);

        assertEquals(playerStateResponse.getBody().get(0).getPlayerId(), 1L);
    }
}