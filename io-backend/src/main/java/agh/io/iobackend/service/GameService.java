package agh.io.iobackend.service;

import agh.io.iobackend.controller.payload.game.PlayerInitialCoord;
import agh.io.iobackend.controller.payload.game.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.game.PlayerStateResponse;
import agh.io.iobackend.exceptions.GameRoomNotFoundException;
import agh.io.iobackend.exceptions.NoGameFoundException;
import agh.io.iobackend.model.game.Game;
import agh.io.iobackend.model.game.GameRoom;
import agh.io.iobackend.model.player.Player;
import agh.io.iobackend.model.player.PlayerStatus;
import agh.io.iobackend.model.user.User;
import agh.io.iobackend.repository.GameRepository;
import agh.io.iobackend.repository.GameRoomRepository;
import agh.io.iobackend.repository.PlayerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.math.*;

@Service
public class GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameService.class);

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private GameRoomRepository gameRoomRepository;

    @Autowired
    private GameRoomService gameRoomService;

    @Autowired
    private PlayerRepository playerRepository;

    private int notifiedPlayers = 0;


    public Game createGame(Game game) {
        logger.info("create game");
        return gameRepository.save(game);
    }

    public Game getGameFromRepo(Long id) throws NoGameFoundException {
        Optional<Game> game = gameRepository.findByGameId(id);
        logger.info("start game");
        if (game.isPresent()){
            return game.get();
        }
        else{
            throw new NoGameFoundException("Cannot find the room");
        }
    }

    public void startGame(Long gameId, ArrayList<PlayerInitialCoord> playerInitialCoordsList) throws NoGameFoundException {
        Game game = getGameFromRepo(gameId);
        for (PlayerInitialCoord playerInitialCoord : playerInitialCoordsList){
            Player player = new Player(playerInitialCoord.getXCoord(), playerInitialCoord.getYCoord(), playerInitialCoord.getUserId());
            playerRepository.save(player);
            game.startGameForPlayer(player);
        }
        game.setPlayerThatStarts();
    }

    public ArrayList<PlayerStateResponse> getPlayerStatesList(Long gameId) throws NoGameFoundException, GameRoomNotFoundException {
        ArrayList<PlayerStateResponse> response = getGameFromRepo(gameId).getPlayerStatesList();

        // nie wiem, czy tak to zrobic i czy tutaj, bo moze to za szybko i cos sie zepsuc (ewentualnie jest do tego endpoint, ktory front moze
        // w odpowiednim czasie zawolac)
        if (response.stream().anyMatch(playerState -> playerState.getPlayerStatus() == PlayerStatus.WON)){
            Game game = getGameFromRepo(gameId);
            game.getNumOfPlayers();
            notifiedPlayers++;
            if(notifiedPlayers == game.getNumOfPlayers())
                endGame(gameId);
        }

        return response;
    }

    public void updateGameStateAfterMove(Game game, PlayerMoveRequest playerMove) {
        game.changeGameState(playerMove);
    }

    public void markWinner(Long gameId, Long userId) throws NoGameFoundException {
        Game game = getGameFromRepo(gameId);
        game.getPlayer(userId).setPlayerStatus(PlayerStatus.WON);
    }

    private double pow_normalized(double x, int normalizer, double base) {
        return Math.pow(x / ((double) normalizer), base);
    }

    // Before the game ends, calculates ranking points with a function:
    //
    //      ranking_fun(z) = 100 * (1 - softmax_pow(z / max(z), 0.5))
    //
    // where softmax_pow is a softmax with exp() substituted by power(x, 0.5)
    // this ranking_fun() calculates rewards for each player in case of his win,
    // but in our use case, we should only update the winners ranking points
    public void endGame(Long gameId) throws NoGameFoundException, GameRoomNotFoundException {
        Game game = getGameFromRepo(gameId);
        Long gameRoomId = game.getGameRoomId();
        GameRoom gameRoom = gameRoomService.getGameRoom(gameRoomId);
        gameRoom.setGameStarted(false);
        List<User> users = gameRoom.getUserList();

        // Calculate components of the ranking_fun()
        LinkedHashMap<User, Integer> ranking = new LinkedHashMap<User, Integer>(statisticsService.getUsersRanking());
        ranking.keySet().retainAll(users);
        int max_ranked = ranking.values().stream().mapToInt(Integer::intValue).sum();
        double sum_ranking = ranking.values().stream().mapToDouble(Integer::doubleValue)
                .map(x -> Math.pow(x / max_ranked, 0.5)).sum();

        if (users.size() == game.getNumOfPlayers()) {  // szczegolnie do testow potrzebne
            for (User user : users) {
                int reward_points = 0;
                if (game.getPlayer(user.getUserId()).checkIfWinner()) {
                    double winner_points = (double) ranking.get(user);
                    reward_points = (int) Math.floor(
                            100.0 * (1.0 - pow_normalized(winner_points, max_ranked, 0.5) / sum_ranking)
                    );
                }
                statisticsService.saveHistoryEntry(game.getMap(), user, game.getPlayer(user.getUserId()).checkPlayerResult(), reward_points);
            }
        }
        gameRoom.setGame(null);
        gameRepository.delete(game);
    }

    public void clearGames(){
        gameRepository.deleteAll();
    }

    public void removeFromGame(Long gameRoomId, Long PlayerId) throws NoGameFoundException {
        GameRoom gameRoom = gameRoomRepository.getById(gameRoomId);
        Game game = getGameFromRepo(gameRoom.getGame().getGameId());
        game.removePlayer(PlayerId);
    }
}
