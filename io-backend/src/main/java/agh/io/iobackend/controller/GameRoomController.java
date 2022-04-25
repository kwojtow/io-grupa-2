package agh.io.iobackend.controller;


import agh.io.iobackend.controller.payload.GameRoomRequest;
import agh.io.iobackend.controller.payload.GameRoomResponse;
import agh.io.iobackend.exceptions.GameRoomNotFoundException;
import agh.io.iobackend.model.GameRoom;
import agh.io.iobackend.model.User;
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
@CrossOrigin
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
        GameRoom gameRoom = new GameRoom(mapService.getMapById(gameRoomRequest.getMapId()).get(), gameRoomRequest.getPlayersLimit(),
                gameRoomRequest.getRoundTime(), gameRoomRequest.getGameMasterId());
        // czy potrzebna jest ta nowa zmienna?
        GameRoom savedGameRoom = gameRoomService.createGameRoom(gameRoom);
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
    public ResponseEntity<GameRoomResponse> getRoomDetails(@PathVariable Long id) throws GameRoomNotFoundException {
        GameRoom gameRoom = gameRoomService.getGameRoom(id);

        GameRoomResponse gameRoomResponse = new GameRoomResponse();
        gameRoomResponse.setRoomId(id);
        gameRoomResponse.setGameMasterId(gameRoom.getGameMasterID());
        gameRoomResponse.setRoundTime(gameRoom.getRoundTime());
        gameRoomResponse.setPlayersLimit(gameRoom.getLimitOfPlayers());
        gameRoomResponse.setMapId(gameRoom.getGameMap().getMapId());

        return ResponseEntity.ok(gameRoomResponse);
    }

    @CrossOrigin
    @GetMapping("/{id}/game") // zwraca id gry - aktualnie to jest nadal roomId
    public ResponseEntity<Long> createGame(@PathVariable Long id) throws GameRoomNotFoundException {
        GameRoom gameRoom = gameRoomService.getGameRoom(id);
        gameService.createGame(gameRoom);
        gameRoom.setGameStarted(true);

        // szkic pozniejszych zmian z nowa klasa Game podobna do GameRoom
//        Game game = new Game(id, gameRoom.getMapID(), gameRoom.getGameMasterID());
//        Game savedGame = gameService.createGame(game);
//        return ResponseEntity.ok(savedGame.getGameId());

        return ResponseEntity.ok(id);

    }

    @CrossOrigin
    @DeleteMapping("/{id}") // room id
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) throws GameRoomNotFoundException {
        gameRoomService.deleteGameRoom(id);
        gameService.deleteGame(id);
        return ResponseEntity.ok("Room deleted");
    }

    @CrossOrigin
    @GetMapping("/{id}/users-list") // room id
    public ResponseEntity<List<User>> getUserListInRoom(@PathVariable Long id) throws GameRoomNotFoundException {
        GameRoom gameRoom = gameRoomService.getGameRoom(id);
        return ResponseEntity.ok(new ArrayList<>(gameRoom.getUserList()));
    }

    @CrossOrigin
    @DeleteMapping("/{id}/users-list/{user}") // room id
    public void leaveGameRoom(@PathVariable Long id, @PathVariable Long user) throws GameRoomNotFoundException {
        GameRoom gameRoom = gameRoomService.getGameRoom(id);
        gameRoom.removePlayer(userService.getUserById(user).get());
    }

    @CrossOrigin
    @PostMapping("/{id}/users-list/{user}") // room id
    public ResponseEntity<User> joinGameRoom(@PathVariable Long id, @PathVariable Long user) throws GameRoomNotFoundException {
        GameRoom gameRoom = gameRoomService.getGameRoom(id);
        User user1 = userService.getUserById(user).get();
        gameRoom.addPlayer(user1);
        return ResponseEntity.ok(user1);
    }

    @CrossOrigin
    @GetMapping("/{id}/game-started") // room-id
    public ResponseEntity<Boolean> checkIfGameStarted(@PathVariable Long id) throws GameRoomNotFoundException {
        return ResponseEntity.ok(gameRoomService.getGameRoom(id).getGameStarted());
    }

}
