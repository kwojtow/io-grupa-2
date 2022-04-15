package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.PlayerStateResponse;
import agh.io.iobackend.service.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;


@RestController
@RequestMapping("/auth/")
public class GameController {
    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    @Autowired
    private GameService gameService;

    @PostMapping("/{id}/state")
    public ResponseEntity<String> changePosition(@RequestBody PlayerMoveRequest playerMove, @PathVariable Long id) {

        if (!gameService.existsByGameId(id)){
            return ResponseEntity.badRequest().body("Game does not exist");
        }
        int xCoordinate = playerMove.getXCoordinate();
        int yCoordinate = playerMove.getYCoordinate();

        logger.info("new position:" + xCoordinate + " " + yCoordinate);

        gameService.updateGameStateAfterMove(gameService.getGame(id), playerMove);

        return ResponseEntity.ok("PLayer moved");
    }

    @GetMapping("/{id}/state")
    public ResponseEntity<ArrayList<PlayerStateResponse>> getGameState(@PathVariable Long id){
        ArrayList<PlayerStateResponse> playersList = gameService.getPlayerStatesList(id);
        return ResponseEntity.ok(playersList);
    }
}


