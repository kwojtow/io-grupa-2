package agh.io.iobackend.model;

import agh.io.iobackend.controller.payload.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.PlayerStateResponse;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.HashMap;

public class GameState {

    private Long gameId;
    private HashMap<Long, Player> players = new HashMap<>();
    private int currentPlayerIndex;
    private ArrayList<Player> playersQueue;


    public GameState(ArrayList<Player> playersQueue) {
        this.playersQueue = playersQueue;
        this.currentPlayerIndex = 0;
        this.playersQueue.get(currentPlayerIndex).setPlayerStatus(PlayerStatus.PLAYING);
        for (Player player : playersQueue) {
            players.put(player.getPlayerId(), player);
        }
    }

    public GameState() {
        this.players = new HashMap<>();
    }

    public void changeGameState(PlayerMoveRequest playerMove) {
        players.get(playerMove.getPlayerId())
                .updatePlayerAfterMove(playerMove.getXCoordinate(), playerMove.getYCoordinate(), playerMove.getVector(),
                        playerMove.getPlayerStatus());

        nextPlayerTurn();
    }

    public ArrayList<PlayerStateResponse> getPlayerStatesList() {
        ArrayList<PlayerStateResponse> playerStatesList = new ArrayList<>();

        for (HashMap.Entry<Long, Player> entry : players.entrySet()) {
            PlayerStateResponse playerStateResponse = new PlayerStateResponse();
            playerStateResponse.setPlayerId(entry.getKey());
            playerStateResponse.setPlayerStatus(entry.getValue().getPlayerStatus());
            playerStateResponse.setXCoordinate(entry.getValue().getPlayerState().getxCoordinate());
            playerStateResponse.setYCoordinate(entry.getValue().getPlayerState().getyCoordinate());
            playerStatesList.add(playerStateResponse);
        }

        return playerStatesList;
    }

    public void addPlayerToGame(Long PlayerId, Player player) {
        this.players.put(PlayerId, player);
    }

    public Player getPlayer(Long playerId) {
        return players.get(playerId);
    }

    private void nextPlayerTurn() {
        while (playersQueue.get(currentPlayerIndex).getPlayerStatus() != PlayerStatus.WAITING) {
            currentPlayerIndex = (currentPlayerIndex + 1) % playersQueue.size();
        }
        playersQueue.get(currentPlayerIndex).setPlayerStatus(PlayerStatus.PLAYING);
    }
}
