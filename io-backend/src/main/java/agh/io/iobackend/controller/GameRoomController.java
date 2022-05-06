package agh.io.iobackend.controller;


import agh.io.iobackend.controller.payload.room.GameRoomRequest;
import agh.io.iobackend.controller.payload.room.GameRoomResponse;
import agh.io.iobackend.exceptions.GameRoomNotFoundException;

import agh.io.iobackend.exceptions.NoGameFoundException;
import agh.io.iobackend.model.game.Game;
import agh.io.iobackend.model.game.GameRoom;
import agh.io.iobackend.model.user.User;
import agh.io.iobackend.service.GameRoomService;
import agh.io.iobackend.service.GameService;
import agh.io.iobackend.service.MapService;
import agh.io.iobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/game-room")
@Transactional // for tests, because of "org.hibernate.LazyInitializationException"
public class GameRoomController {

    @Autowired
    private GameRoomService gameRoomService;

    @Autowired
    private GameService gameService;

    @Autowired
    private UserService userService;

    @Autowired
    private MapService mapService;

    // TODO sprawdz czy gra istnieje, czy uzytkownik istnieje
    // TODO gameId generowane jako inne niz roomId
    // TODO obsługa błędów

    @CrossOrigin
    @PostMapping("")
    public ResponseEntity<GameRoomResponse> createRoom(@RequestBody GameRoomRequest gameRoomRequest) {
        GameRoom gameRoom = new GameRoom(
                mapService.getMapById(gameRoomRequest.getMapId()).get(),
                gameRoomRequest.getPlayersLimit(),
                gameRoomRequest.getRoundTime(),
                gameRoomRequest.getGameMasterId()
        );
        GameRoom savedGameRoom = gameRoomService.createGameRoom(gameRoom);
//        savedGameRoom.addPlayer(userService.getUserById(gameRoomRequest.getGameMasterId()).get());
        GameRoomResponse gameRoomResponse = new GameRoomResponse();
        gameRoomResponse.setRoomId(savedGameRoom.getGameRoomID());
        gameRoomResponse.setGameMasterId(gameRoomRequest.getGameMasterId());
        gameRoomResponse.setRoundTime(gameRoomRequest.getRoundTime());
        gameRoomResponse.setPlayersLimit(gameRoomRequest.getPlayersLimit());
        gameRoomResponse.setMapId(gameRoomRequest.getMapId());

        return ResponseEntity.ok(gameRoomResponse);
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
        Game game = new Game(gameRoomService.getGameRoom(id), gameRoom.getGameMap());
        Game savedGame = gameService.createGame(game);
        gameRoom.setGame(savedGame);

        return ResponseEntity.ok(savedGame.getGameId());
    }

    @CrossOrigin
    @DeleteMapping("/{id}") // room id
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
        try {
            gameRoomService.deleteGameRoom(id);
        } catch (GameRoomNotFoundException e) {
            return ResponseEntity.badRequest().body("Game room not found");
        }
        // cos jeszcze?
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
    public void leaveGameRoom(@PathVariable Long id, @PathVariable Long user) throws GameRoomNotFoundException {
        GameRoom gameRoom = gameRoomService.getGameRoom(id);
        gameRoom.removePlayer(userService.getUserById(user).get());
        if (gameRoom.getUserList().size() == 0) {
            gameRoomService.deleteGameRoom(id);
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
        // w przeciwnym przypadku zwraca gameId już wygenerowane poprzez rozpoczecie
        // gry przez GameMastera (prez klikniecie start-game)
        // i teraz zarowno gracze jak i gameMaster zwracaja się do GameController - startGame
        // po wspolrzedne poczatkowe graczy
        return ResponseEntity.ok(gameId);
    }

}
