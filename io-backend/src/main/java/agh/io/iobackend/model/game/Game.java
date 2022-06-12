package agh.io.iobackend.model.game;

import agh.io.iobackend.controller.payload.game.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.game.PlayerStateResponse;
import agh.io.iobackend.model.Vector;
import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.player.Player;
import agh.io.iobackend.model.player.PlayerStatus;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@NoArgsConstructor
@Entity(name = "Game")
public class Game {

    private static final Logger logger = LoggerFactory.getLogger(Game.class);

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
            name = "id",
            updatable = false
    )
    private Long id;

    @Column(name = "game_id")
    private Long gameId; // gameRoomId

    @OneToOne
    private GameMap gameMap;

    @ElementCollection
    private List<Long> playersQueue;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private final Map<Long, Player> players = new HashMap<>();

    private int currentPlayerIndex;

    public Game(Long gameRoomId, GameMap map) {
        this.gameId = gameRoomId;
        this.gameMap = map;
        this.currentPlayerIndex = 0;
        this.playersQueue = new ArrayList<>();
    }

    public Game(Long gameId, Long mapId) {
    }

    public void startGameForPlayer(Player player) {
        playersQueue.add(player.getPlayerId());
        players.put(player.getPlayerId(), player);
    }

    public void setPlayerThatStarts() {
        Long currentPlayerId = playersQueue.get(currentPlayerIndex);
        players.get(currentPlayerId).setPlayerStatus(PlayerStatus.PLAYING);
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
            playerStateResponse.setColor(playerDetails.getColor());
            playerStatesList.add(playerStateResponse);
        }
        return playerStatesList;
    }

    private void nextPlayerTurn() {
        // the player that was playing now
        int oldIndex = currentPlayerIndex;

        // next player that should play
        currentPlayerIndex = (currentPlayerIndex + 1) % playersQueue.size();

//        while(players.get(getCurrentPlayerId()).getPlayerStatus() == PlayerStatus.LOST)
//            currentPlayerIndex = (currentPlayerIndex + 1) % playersQueue.size();


        // WON from frontend --- if someone got the end or all the other players lost
        if (playersQueue.stream().anyMatch(id -> players.get(id).getPlayerStatus() == PlayerStatus.WON)) {
            long winner = playersQueue.stream().filter(id -> players.get(id).getPlayerStatus() == PlayerStatus.WON).findAny().get();

            //set all other players status to LOST (some of them can have this status already)
            players.entrySet().stream().filter(id -> id.getKey() != winner).forEach(e -> e.getValue().setPlayerStatus(PlayerStatus.LOST));
        }

        // all the players that are waiting
        Stream<Long> activePlayers = playersQueue.stream().filter(id -> players.get(id).getPlayerStatus() == PlayerStatus.WAITING);

        long activePlayersCount = activePlayers.count();

        while (activePlayersCount > 0 && players.get(getCurrentPlayerId()).getPlayerStatus() != PlayerStatus.WAITING) { //waits for the first waiting
            logger.info("while in game state");
            currentPlayerIndex = (currentPlayerIndex + 1) % playersQueue.size();
        }

        if(players.get(playersQueue.get(oldIndex)).getPlayerStatus() == PlayerStatus.PLAYING)
            players.get(playersQueue.get(oldIndex)).setPlayerStatus(PlayerStatus.WAITING);
        System.out.println("on turn: " + getCurrentPlayerId());
        if(playersQueue.size() > 1)
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
        return gameId;
    }

    public void removePlayer(Long playerId) {
        this.playersQueue.remove(playerId);
        this.players.remove(playerId);
    }

    public int getNumOfPlayers() {
        return players.size();
    }
}