package agh.io.iobackend.service;

import agh.io.iobackend.controller.payload.GameRoomRequest;
import agh.io.iobackend.controller.payload.PlayerInitialCoord;
import agh.io.iobackend.controller.payload.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.PlayerStateResponse;
import agh.io.iobackend.model.GameRoom;
import agh.io.iobackend.model.GameState;
import agh.io.iobackend.model.Player;
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

    public void createGame(GameRoomRequest gameRoomRequest, Long gameId){
        // na razie podaje gameRoomId jako room id i game id
        GameState gameState = new GameState(gameId, gameId, gameRoomRequest.getMapId(), gameRoomRequest.getGameMasterId());
        addGame(gameId, gameState);
    }

    public void startGame(Long gameId, ArrayList<PlayerInitialCoord> playerInitialCoordsList){
        getGame(gameId).startGame(playerInitialCoordsList);
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

    public void deleteGame(Long gameId){
        this.games.remove(gameId);
    }

    public Boolean existsByGameId(Long gameId){
        return this.getGame(gameId) != null;
    }

    public void addGame(Long gameId, GameState gameState){
        this.games.put(gameId, gameState);
    }
}
