package agh.io.iobackend.model;
import agh.io.iobackend.controller.payload.PlayerInitialCoord;
import agh.io.iobackend.controller.payload.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.PlayerStateResponse;

import java.util.ArrayList;
import java.util.HashMap;

public class GameState {

    private Long gameId;
    private Long gameRoomId;
    private Long mapId;
    private Long gameMasterId;
    private HashMap<Long, Player> players = new HashMap<>();
    private int currentPlayerIndex;
    private final ArrayList<Long> playersQueue;
    private Boolean gameStarted;

    public GameState(Long gameId, Long gameRoomId, Long mapId, Long gameMasterId) {
        this.gameId = gameId;
        this.gameRoomId = gameRoomId;
        this.mapId = mapId;
        this.gameMasterId = gameMasterId;
        this.gameStarted = false;
        this.players = new HashMap<>();
        this.playersQueue = new ArrayList<>();
    }

    public GameState(){
        this.gameStarted = false;
        this.players = new HashMap<>();
        this.playersQueue = new ArrayList<>();
    }

    public void startGame(ArrayList<PlayerInitialCoord> playerInitialCoordsList){
        for (PlayerInitialCoord playerInitialCoord : playerInitialCoordsList){
            this.playersQueue.add(playerInitialCoord.getUserId());
            this.players.put(playerInitialCoord.getUserId(),
                    new Player(playerInitialCoord.getXCoord(),
                            playerInitialCoord.getYCoord(), playerInitialCoord.getUserId()));
        }
        this.gameStarted = true;
        Long currentPlayerId= this.playersQueue.get(currentPlayerIndex);
        this.players.get(currentPlayerId).setPlayerStatus(PlayerStatus.PLAYING);
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

    public void addPlayerToGame(Long playerId, Player player) {
        this.players.put(playerId, player);
        this.playersQueue.add(playerId);
    }

    public Player getPlayer(Long playerId) {
        return players.get(playerId);
    }

    public Long getCurrentPlayerId(){
        return this.playersQueue.get(currentPlayerIndex);
    }

    public Boolean getGameStarted(){
        return gameStarted;
    }

    public void setGameStarted(Boolean gameStarted){
        this.gameStarted = gameStarted;
    }

    private void nextPlayerTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % playersQueue.size();

        while (players.get(getCurrentPlayerId()).getPlayerStatus() != PlayerStatus.WAITING) {
            currentPlayerIndex = (currentPlayerIndex + 1) % playersQueue.size();
        }
        players.get(getCurrentPlayerId()).setPlayerStatus(PlayerStatus.PLAYING);
    }


}
