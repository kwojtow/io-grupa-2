package agh.io.iobackend.controller;


import agh.io.iobackend.controller.payload.GameRoomRequest;
import agh.io.iobackend.controller.payload.GameRoomResponse;
import agh.io.iobackend.exceptions.GameRoomNotFoundException;
import agh.io.iobackend.model.GameRoom;
import agh.io.iobackend.service.GameRoomService;
import agh.io.iobackend.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/game-room")
public class GameRoomController {

    @Autowired
    GameRoomService gameRoomService;

    @Autowired
    GameService gameService;

    // TODO sprawdz czy gra istnieje, czy uzytkownik istnieje
    // TODO gameId generowane jako inne niz roomId

    @PostMapping("")
    public ResponseEntity<GameRoomResponse> createRoom(@RequestBody GameRoomRequest gameRoomRequest) {
        GameRoom gameRoom = new GameRoom(gameRoomRequest.getMapId(), gameRoomRequest.getPlayersLimit(),
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

    @GetMapping("/{id}") // room id
    public ResponseEntity<GameRoomResponse> getRoomDetails(@PathVariable Long id) throws GameRoomNotFoundException {
        GameRoom gameRoom = gameRoomService.getGameRoom(id);

        GameRoomResponse gameRoomResponse = new GameRoomResponse();
        gameRoomResponse.setRoomId(id);
        gameRoomResponse.setGameMasterId(gameRoom.getGameMasterID());
        gameRoomResponse.setRoundTime(gameRoom.getRoundTime());
        gameRoomResponse.setPlayersLimit(gameRoom.getLimitOfPlayers());
        gameRoomResponse.setMapId(gameRoom.getMapID());

        return ResponseEntity.ok(gameRoomResponse);
    }

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

    @DeleteMapping("/{id}") // room id
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) throws GameRoomNotFoundException {
        gameRoomService.deleteGameRoom(id);
        gameService.deleteGame(id);
        return ResponseEntity.ok("Room deleted");
    }

    @GetMapping("/{id}/users-list") // room id
    public ResponseEntity<List<Long>> getUserListInRoom(@PathVariable Long id) throws GameRoomNotFoundException {
        GameRoom gameRoom = gameRoomService.getGameRoom(id);
        return ResponseEntity.ok(gameRoom.getUserList());
    }

    @DeleteMapping("/{id}/users-list/{user}") // room id
    public void leaveGameRoom(@PathVariable Long id, @PathVariable Long user) throws GameRoomNotFoundException {
        GameRoom gameRoom = gameRoomService.getGameRoom(id);
        gameRoom.removePlayer(user);
    }

    @PostMapping("/{id}/users-list/{user}") // room id
    public ResponseEntity<String> joinGameRoom(@PathVariable Long id, @PathVariable Long user) throws GameRoomNotFoundException {
        GameRoom gameRoom = gameRoomService.getGameRoom(id);
        gameRoom.addPlayer(user);
        return ResponseEntity.ok("User added");
    }

    @GetMapping("/{id}/game-started") // room-id
    public ResponseEntity<Boolean> checkIfGameStarted(@PathVariable Long id) throws GameRoomNotFoundException {
        return ResponseEntity.ok(gameRoomService.getGameRoom(id).getGameStarted());
    }

}
