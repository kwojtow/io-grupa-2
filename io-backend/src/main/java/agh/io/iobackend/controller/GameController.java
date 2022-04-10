package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.MoveRequest;
import agh.io.iobackend.model.GameState;
import agh.io.iobackend.service.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class GameController {
    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    @Autowired
    private GameService gameService;

    @PostMapping("/move")
    public ResponseEntity<Pair<Integer, Integer>> changePosition(@RequestBody MoveRequest moveRequest) {

        int xChange = moveRequest.getXChange();
        int yChange = moveRequest.getYChange();

        logger.info("move to insert:" + xChange + " " + yChange);

        if (!gameService.existsByGameId(moveRequest.getGameId())){
            return ResponseEntity.badRequest().body(Pair.of(-1,-1));
        }

        Long gameId = moveRequest.getGameId();
        Long playerId = moveRequest.getPlayerId();

        gameService.changeGameState(gameService.getGame(gameId), playerId, xChange, yChange);
        Pair<Integer, Integer> newPos = gameService.getGame(gameId).getPlayer(playerId).getPlayerState().getPlayerPosition();

        return ResponseEntity.ok(newPos);
    }
}
