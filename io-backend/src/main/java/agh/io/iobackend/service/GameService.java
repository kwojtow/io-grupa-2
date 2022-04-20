package agh.io.iobackend.service;

import agh.io.iobackend.controller.payload.PlayerInitialCoord;
import agh.io.iobackend.controller.payload.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.PlayerStateResponse;
import agh.io.iobackend.model.GameRoom;
import agh.io.iobackend.model.GameState;
import agh.io.iobackend.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    // gameId -> GameState
    private final HashMap<Long, GameState> games;

    public GameService() {
        this.games = new HashMap<>();
    }

//    public Game createGame(Game game) {
//        return gameRepository.save(game);
//    }
//
//    public Game getGameFromRepo(Long id) throws NoGameFoundException {
//        Optional<Game> game = gameRepository.findById(id);
//        if (game.isPresent()){
//            return game.get();
//        }
//        else{
//            throw new NoGameFoundException("Cannot find the room");
//        }
//    }

    // funkcja do czasu az bedzie lepsza obsługa gier i gra sama wygeneruje sobie Id
    public void createGame(GameRoom gameRoom){
        GameState gameState = new GameState(gameRoom.getGameRoomID(), gameRoom.getGameRoomID(), gameRoom.getGameMap(), gameRoom.getGameMasterID());
        addGame(gameRoom.getGameRoomID(), gameState);
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
