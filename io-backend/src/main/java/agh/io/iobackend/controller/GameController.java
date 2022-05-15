package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.game.PlayerInitialCoord;
import agh.io.iobackend.controller.payload.game.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.game.PlayerStateResponse;
import agh.io.iobackend.exceptions.GameRoomNotFoundException;
import agh.io.iobackend.exceptions.NoGameFoundException;
import agh.io.iobackend.service.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.ArrayList;


@RestController
@RequestMapping("/game/")
@Transactional
public class GameController {
    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    @Autowired
    private GameService gameService;

    @PostMapping("/{id}/state")
    public ResponseEntity<String> changePosition(@RequestBody PlayerMoveRequest playerMove, @PathVariable Long id) {
        int xCoordinate = playerMove.getXCoordinate();
        int yCoordinate = playerMove.getYCoordinate();

        try {
            gameService.updateGameStateAfterMove(gameService.getGameFromRepo(id), playerMove);
            logger.info("new position:" + xCoordinate + " " + yCoordinate);
        } catch (NoGameFoundException e) {
            return ResponseEntity.badRequest().body("Game not found");
        }
        return ResponseEntity.ok("PLayer moved");
    }

    @GetMapping("/{id}/state")
    public ResponseEntity<ArrayList<PlayerStateResponse>> getGameState(@PathVariable Long id) {
        ArrayList<PlayerStateResponse> playersList = null;
        try {
            playersList = gameService.getPlayerStatesList(id);
        } catch (NoGameFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(playersList);
    }

    @PostMapping("/{id}") // game id - poczatkowe wspolrzedne
    public void startGame(@RequestBody ArrayList<PlayerInitialCoord> playerInitialCoordList, @PathVariable Long id) {
        try {
            gameService.startGame(id, playerInitialCoordList);
        } catch (NoGameFoundException e) {
            logger.info("No game found");
        }
    }

    @DeleteMapping("/{id}/state")
    public ResponseEntity<String> endGame(@PathVariable Long id) {
        try {
            gameService.endGame(id);
        } catch (NoGameFoundException e) {
            return ResponseEntity.badRequest().body("Game not found");
        } catch (GameRoomNotFoundException e) {
            return ResponseEntity.badRequest().body("Room not found");
        }
        return ResponseEntity.ok("Game ended");
    }
}