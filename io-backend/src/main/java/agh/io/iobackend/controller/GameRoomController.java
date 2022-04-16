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

        GameRoomResponse gameRoomResponse = new GameRoomResponse();
        gameRoomResponse.setRoomId(gameRoom.getGameRoomID());
        gameRoomResponse.setGameMasterId(gameRoomRequest.getGameMasterId());
        gameRoomResponse.setRoundTime(gameRoomRequest.getRoundTime());
        gameRoomResponse.setPlayersLimit(gameRoomRequest.getPlayersLimit());
        gameRoomResponse.setMapId(gameRoomRequest.getMapId());

        gameService.createGame(gameRoomRequest, gameRoom.getGameRoomID());
        // na razie ustawiam gameId na roomId
        // ale trzeba ulepszyc tworzenie gier
        // zwracac gameID i wtedy wiedza gdzie pytac o game-started

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
}
