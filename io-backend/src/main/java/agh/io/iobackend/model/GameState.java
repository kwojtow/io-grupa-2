package agh.io.iobackend.model;
import java.util.HashMap;

public class GameState {

    private Long gameId;
    private final HashMap<Long, Player> players;

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

    public Boolean canMakeMove(Long playerId, int xChange, int yChange){
        Player currPlayer = players.get(playerId);
        int newX = currPlayer.getPlayerState().getPlayerPosition().getFirst() + xChange;
        int newY = currPlayer.getPlayerState().getPlayerPosition().getSecond() + yChange;

        return checkIfEmptyPosition(newX, newY);
    }

    public Boolean checkIfEmptyPosition(int newX, int newY) {
        for (Player player : players.values()) {
            if (player.getPlayerState().checkCoordinates(newX, newY)){
                return false;
            }
        }
        return true;
    }

    public void addPlayerToGame(Long PlayerId, Player player){
        this.players.put(PlayerId, player);
    }

    public Player getPlayer(Long playerId){
        return players.get(playerId);
    }


}
