package agh.io.iobackend.model.game;

import agh.io.iobackend.controller.payload.game.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.game.PlayerStateResponse;
import agh.io.iobackend.model.Vector;
import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.player.Player;
import agh.io.iobackend.model.player.PlayerStatus;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@NoArgsConstructor
@Entity(name = "Game")
public class Game {

    @Id
    @SequenceGenerator(
            name = "game_sequence",
            sequenceName = "game_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "game_sequence"
    )
    @Column(
            name = "game_id",
            updatable = false
    )
    private Long gameId;

    @Column(name = "gameRoomId")
    private Long gameRoomId; // czy GameRoom

    @OneToOne
    private GameMap gameMap;

    @ElementCollection
    private List<Long> playersQueue;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private final Map<Long, Player> players = new HashMap<>();

    private int currentPlayerIndex;

    public Game(Long gameRoomId, GameMap map) {
        this.gameRoomId = gameRoomId;
        this.gameMap = map;
        this.currentPlayerIndex = 0;
    }

    public Game(Long gameId, Long mapId) {
    }

    public void startGameForPlayer(Player player) {
        System.out.println("Game started for + " + player);
        playersQueue.add(player.getPlayerId());
        players.put(player.getPlayerId(), player);
    }

    public void setPlayerThatStarts() {
        Long currentPlayerId = playersQueue.get(currentPlayerIndex);
        players.get(currentPlayerId).setPlayerStatus(PlayerStatus.PLAYING);
        System.out.println("curr" + currentPlayerIndex + currentPlayerId);
    }

    public ArrayList<PlayerStateResponse> getPlayerStatesList() {
        ArrayList<PlayerStateResponse> playerStatesList = new ArrayList<>();
        System.out.println("in getPlayers State" + players);
        for (Long playerId : playersQueue) {
            PlayerStateResponse playerStateResponse = new PlayerStateResponse();
            Player playerDetails = players.get(playerId);
            playerStateResponse.setPlayerId(playerId);
            playerStateResponse.setPlayerStatus(playerDetails.getPlayerStatus());
            playerStateResponse.setXCoordinate(playerDetails.getXCoordinate());
            playerStateResponse.setYCoordinate(playerDetails.getYCoordinate());
            playerStateResponse.setVector(new Vector(playerDetails.getXVector(), playerDetails.getYVector()));
            playerStatesList.add(playerStateResponse);
        }
        return playerStatesList;
    }

    private void nextPlayerTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % playersQueue.size();

        while (players.get(getCurrentPlayerId()).getPlayerStatus() != PlayerStatus.WAITING) { // TODO why != WAITING ? wydaje mi se ze to dziala, bo po prostu kolejny czekajacy jest brany
            currentPlayerIndex = (currentPlayerIndex + 1) % playersQueue.size();  // frontend zmienia z playing na waiting albo na lost a waiting zostaje, bo oni chyba nie wiedza kto nastepny (?)
        }
        players.get(getCurrentPlayerId()).setPlayerStatus(PlayerStatus.PLAYING);
    }

    public void changeGameState(PlayerMoveRequest playerMove) {
        players.get(playerMove.getPlayerId())
                .updatePlayerAfterMove(playerMove.getXCoordinate(), playerMove.getYCoordinate(), playerMove.getVector().getX(), playerMove.getVector().getY(),
                        playerMove.getPlayerStatus());

        nextPlayerTurn();
    }

    public Player getPlayer(Long playerId) {
        return players.get(playerId);
    }

    public Long getCurrentPlayerId() {
        return playersQueue.get(currentPlayerIndex);
    }

    public Long getGameId() {
        return gameId;
    }

    public GameMap getMap() {
        return gameMap;
    }

    public Long getGameRoomId() {
        return gameRoomId;
    }

    public void removePlayer(Long playerId) {
        this.playersQueue.remove(playerId);
        this.players.remove(playerId);
    }
}
