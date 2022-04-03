package agh.io.iobackend.service;

import agh.io.iobackend.model.GameState;

import java.util.HashMap;

public class GameService {

    // gameId -> GameState
    private HashMap<Long, GameState> games;

    public GameService(){

    }

    public GameState getGame(Long gameId){
        return games.get(gameId);
    }

    public void changeGameState(GameState gameState, Long playerId, int xChange, int yChange) {
        gameState.changeGameState(playerId, xChange, yChange);
    }

}
