package agh.io.iobackend.controller;


import agh.io.iobackend.controller.payload.room.GameRoomRequest;
import agh.io.iobackend.controller.payload.room.GameRoomResponse;
import agh.io.iobackend.exceptions.GameRoomNotFoundException;

import agh.io.iobackend.exceptions.NoGameFoundException;
import agh.io.iobackend.model.game.Game;
import agh.io.iobackend.model.game.GameRoom;
import agh.io.iobackend.model.user.User;
import agh.io.iobackend.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/game-room")
@CrossOrigin
@Transactional // for tests, because of "org.hibernate.LazyInitializationException"
public class GameRoomController {

    private static final Logger logger = LoggerFactory.getLogger(GameRoomController.class);

    @Autowired
    private GameRoomService gameRoomService;

    @Autowired
    private GameService gameService;

    @Autowired
    private UserService userService;

    @Autowired
    private MapService mapService;

    @Autowired
    private RandomGameService randomGameService;


    //TODO gdy GameMaster wychodzi powinno chyba zamykac pokoj, bo gracz i tak nie moze rozpoczac

    @CrossOrigin
    @PostMapping("")
    public ResponseEntity<GameRoomResponse> createRoom(@RequestBody GameRoomRequest gameRoomRequest) {
        GameRoom gameRoom = new GameRoom(
                mapService.getMapById(gameRoomRequest.getMapId()),
                gameRoomRequest.getPlayersLimit(),
                gameRoomRequest.getRoundTime(),
                gameRoomRequest.getGameMasterId()
        );
        GameRoom savedGameRoom = gameRoomService.createGameRoom(gameRoom);
//        savedGameRoom.addPlayer(userService.getUserById(gameRoomRequest.getGameMasterId()).get()); // add GameMaster
        GameRoomResponse gameRoomResponse = new GameRoomResponse();
        gameRoomResponse.setRoomId(savedGameRoom.getGameRoomID());
        gameRoomResponse.setGameMasterId(gameRoomRequest.getGameMasterId());
        gameRoomResponse.setRoundTime(gameRoomRequest.getRoundTime());
        gameRoomResponse.setPlayersLimit(gameRoomRequest.getPlayersLimit());
        gameRoomResponse.setMapId(gameRoomRequest.getMapId());

        return ResponseEntity.ok(gameRoomResponse);
    }


    @CrossOrigin
    @PostMapping("/random")
    public ResponseEntity<Long> joinRandomRoom(){ // zwraca game room id
        logger.info("Joining Random Room");
        return ResponseEntity.ok().body(randomGameService.joinRandomRoom(userService.getCurrentUser().getUserId()));
    }


    @CrossOrigin
    @GetMapping("/{id}") // room id
    public ResponseEntity<GameRoomResponse> getRoomDetails(@PathVariable Long id) {
        GameRoom gameRoom;
        try {
            gameRoom = gameRoomService.getGameRoom(id);
        } catch (GameRoomNotFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }

        GameRoomResponse gameRoomResponse = new GameRoomResponse();
        gameRoomResponse.setRoomId(id);
        gameRoomResponse.setGameMasterId(gameRoom.getGameMasterID());
        gameRoomResponse.setRoundTime(gameRoom.getRoundTime());
        gameRoomResponse.setPlayersLimit(gameRoom.getLimitOfPlayers());
        gameRoomResponse.setMapId(gameRoom.getGameMap().getMapId());

        return ResponseEntity.ok(gameRoomResponse);
    }

    @CrossOrigin
    @GetMapping("/{id}/game") // zaczecie gry przez Game Mastera - zwraca id gry
    public ResponseEntity<Long> createGame(@PathVariable Long id) throws GameRoomNotFoundException {
        GameRoom gameRoom;
        try {
            gameRoom = gameRoomService.getGameRoom(id);
        } catch (GameRoomNotFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }
        gameRoom.setGameStarted(true);
        Game game = new Game(id, gameRoom.getGameMap());
        Game savedGame = gameService.createGame(game);
        gameRoom.setGame(savedGame);

        return ResponseEntity.ok(savedGame.getGameId());
    }

    @CrossOrigin
    @DeleteMapping("/{id}") // room id
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
        try {
            GameRoom gameRoom = gameRoomService.getGameRoom(id);
            if (gameRoom.getGameStarted()){
                System.out.println(gameRoom.getGame().getGameId());
                gameService.endGame(gameRoom.getGame().getGameId());
            }
            gameRoomService.deleteGameRoom(id);
        } catch (GameRoomNotFoundException e) {
            return ResponseEntity.badRequest().body("Game room not found");
        } catch (NoGameFoundException e) {
            return ResponseEntity.badRequest().body("Game not found");
        }
        return ResponseEntity.ok("Room deleted");
    }

    @CrossOrigin
    @GetMapping("/{id}/users-list") // room id
    public ResponseEntity<List<User>> getUserListInRoom(@PathVariable Long id) {
        GameRoom gameRoom = null;
        try {
            gameRoom = gameRoomService.getGameRoom(id);
        } catch (GameRoomNotFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(new ArrayList<>(gameRoom.getUserList()));
    }

    @CrossOrigin
    @DeleteMapping("/{id}/users-list/{user}") // room id
    public void leaveGameRoom(@PathVariable Long id, @PathVariable Long user) throws NoGameFoundException {
       GameRoom gameRoom = null;
        try {
            gameRoom = gameRoomService.getGameRoom(id);
       }
       catch (GameRoomNotFoundException e){
           logger.error("No room");
       }
        gameRoom.removePlayer(userService.getUserById(user).get());
        if (gameRoom.getGameStarted()){
            gameService.removeFromGame(id, user);
        }
        if (gameRoom.getUserList().size() == 0) {
            try {
                gameRoomService.deleteGameRoom(id);
            } catch (GameRoomNotFoundException e){
                logger.error("No room");
            }
        }
    }

    @CrossOrigin
    @PostMapping("/{id}/users-list/{user}") // room id
    public ResponseEntity<String> joinGameRoom(@PathVariable Long id, @PathVariable Long user) {
        try {
            GameRoom gameRoom = gameRoomService.getGameRoom(id);
            if (userService.getUserById(user).isPresent()) {
                if (gameRoom.getLimitOfPlayers() > gameRoom.getUserList().size()) {
                    gameRoom.addPlayer(userService.getUserById(user).get());
                    return ResponseEntity.ok("User added");
                }
            } else {
                return ResponseEntity.badRequest().body("No user");
            }
            if (gameRoom.getGameStarted()){
                return ResponseEntity.badRequest().body("Game has already started, cannot join");
            }
        } catch (GameRoomNotFoundException e) {
            return ResponseEntity.badRequest().body("No room");
        }
        return ResponseEntity.badRequest().body("Cannot add user - too many players");
    }

    @CrossOrigin
    @GetMapping("/{id}/game-started") // room-id
    public ResponseEntity<Long> checkIfGameStarted(@PathVariable Long id) {
        Long gameId = -1L;
        try {
            if (gameRoomService.getGameRoom(id).getGameStarted()) {
                gameId = gameRoomService.getGameIdByRoomId(id);
            }
        } catch (GameRoomNotFoundException e) {
            return ResponseEntity.badRequest().body(-1L);
        }
        // zwraca gameId - jak gameStarted to false to zwraca -1 moze tak byc??
        return ResponseEntity.ok(gameId);
    }

}
