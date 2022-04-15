package agh.io.iobackend.service;

import agh.io.iobackend.controller.payload.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.PlayerStateResponse;
import agh.io.iobackend.model.GameState;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public ArrayList<PlayerStateResponse> getPlayerStatesList(Long gameId){
        return getGame(gameId).getPlayerStatesList();
    }

    public void updateGameStateAfterMove(GameState gameState, PlayerMoveRequest playerMove) {
        gameState.changeGameState(playerMove);
    }

    public Boolean existsByGameId(Long gameId){
        return this.getGame(gameId) != null;
    }

    public void addGame(Long gameId, GameState gameState){
        this.games.put(gameId, gameState);
    }
}
