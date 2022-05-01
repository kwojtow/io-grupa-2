package agh.io.iobackend.model.game;

import agh.io.iobackend.controller.payload.game.PlayerInitialCoord;
import agh.io.iobackend.controller.payload.game.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.game.PlayerStateResponse;
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
    private Long gameRoomId;

    @OneToOne
    private GameMap gameMap;

    @ElementCollection
    private final List<Long> playersQueue = new ArrayList<>();

    @Transient
    private final Map<Long, Player> players = new HashMap<>();

    private int currentPlayerIndex;

    public Game(Long roomId, GameMap map) {
        this.gameRoomId = roomId;
        this.gameMap = map;
        this.currentPlayerIndex = 0;
    }

    public void startGame(ArrayList<PlayerInitialCoord> playerInitialCoordsList) {
        for (PlayerInitialCoord playerInitialCoord : playerInitialCoordsList) {
            playersQueue.add(playerInitialCoord.getUserId());
            players.put(playerInitialCoord.getUserId(),
                    new Player(playerInitialCoord.getXCoord(),
                            playerInitialCoord.getYCoord(), playerInitialCoord.getUserId()));
        }
        Long currentPlayerId = playersQueue.get(currentPlayerIndex);
        players.get(currentPlayerId).setPlayerStatus(PlayerStatus.PLAYING);
    }

    public ArrayList<PlayerStateResponse> getPlayerStatesList() {
        ArrayList<PlayerStateResponse> playerStatesList = new ArrayList<>();

        for (HashMap.Entry<Long, Player> entry : players.entrySet()) {
            PlayerStateResponse playerStateResponse = new PlayerStateResponse();
            playerStateResponse.setPlayerId(entry.getKey());
            playerStateResponse.setPlayerStatus(entry.getValue().getPlayerStatus());
            playerStateResponse.setXCoordinate(entry.getValue().getxCoordinate());
            playerStateResponse.setYCoordinate(entry.getValue().getyCoordinate());
            playerStatesList.add(playerStateResponse);
        }
        return playerStatesList;
    }

    private void nextPlayerTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % playersQueue.size();

        while (players.get(getCurrentPlayerId()).getPlayerStatus() != PlayerStatus.WAITING) { // TODO why != WAITING ?
            currentPlayerIndex = (currentPlayerIndex + 1) % playersQueue.size();
        }
        players.get(getCurrentPlayerId()).setPlayerStatus(PlayerStatus.PLAYING);
    }

    public void changeGameState(PlayerMoveRequest playerMove) {
        players.get(playerMove.getPlayerId())
                .updatePlayerAfterMove(playerMove.getXCoordinate(), playerMove.getYCoordinate(), playerMove.getVector(),
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

}
