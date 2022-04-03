package agh.io.iobackend.model;

import java.util.HashMap;

public class GameState {

    private Long gameId;
    private HashMap<Long, Player> players;

    public GameState(HashMap<Long, Player> players){
        this.players = players;
    }

    public GameState(){
       this.players = new HashMap<>();
    }

    // the chosen direction
    public void changeGameState(Long playerId, int xChange, int yChange){
        players.get(playerId).changePlayerState(xChange, yChange);
    }

}
