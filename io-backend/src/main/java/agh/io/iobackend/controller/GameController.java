package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.MoveRequest;
import agh.io.iobackend.service.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class GameController {
    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    @Autowired
    private GameService gameService;

    @PostMapping("/move")
    public String changePosition(@RequestBody MoveRequest moveRequest) {

        int xChange = moveRequest.getXChange();
        int yChange = moveRequest.getYChange();

        logger.info("move to insert:" + xChange + " " + yChange);

        gameService.changeGameState(gameService.getGame(moveRequest.getGameId()), moveRequest.getPlayerId(), xChange, yChange);

        return "moved";
    }
}
