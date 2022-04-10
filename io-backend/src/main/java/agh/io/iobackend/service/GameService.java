package agh.io.iobackend.service;

import agh.io.iobackend.model.GameState;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class GameService {

    // gameId -> GameState
    private final HashMap<Long, GameState> games;

    public GameService() {
        this.games = new HashMap<>();
    }

    public GameState getGame(Long gameId) {
        return games.get(gameId);
    }

    public void changeGameState(GameState gameState, Long playerId, int xChange, int yChange) {
        gameState.changeGameState(playerId, xChange, yChange);
    }

    public Boolean existsByGameId(Long gameId){
        return this.getGame(gameId) != null;
    }

    public void addGame(Long gameId, GameState gameState){
        this.games.put(gameId, gameState);

    }
}
