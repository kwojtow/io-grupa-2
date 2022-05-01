package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.auth.JwtResponse;
import agh.io.iobackend.controller.payload.auth.SigninRequest;
import agh.io.iobackend.controller.payload.auth.SignupRequest;
import agh.io.iobackend.controller.payload.room.GameRoomRequest;
import agh.io.iobackend.controller.payload.room.GameRoomResponse;
import agh.io.iobackend.exceptions.GameRoomNotFoundException;
import agh.io.iobackend.model.Vector;
import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.MapStructure;
import agh.io.iobackend.repository.GameRoomRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;


@SpringBootTest
public class GameRoomControllerTest {

    @Autowired
    private GameRoomController gameRoomController;

    private static Long roomId;
    private static Long mapId = 1L;
    private static Long gameMasterId;
    private static Integer roundTime = 4;
    private static Integer playersLimit = 2;
    private static Long user1Id;


    private static void createUsers(AuthController authController) {

        // user - gameMaster
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("uname");
        signupRequest.setEmail("email123@mail.com");
        signupRequest.setPassword("pass");

        ResponseEntity<String> signupResponse = authController.registerUser(signupRequest);
        assertEquals(200, signupResponse.getStatusCodeValue());

        SigninRequest signinRequest = new SigninRequest();
        signinRequest.setUsername("uname");
        signinRequest.setPassword("pass");

        ResponseEntity<JwtResponse> signinResponse = authController.loginUser(signinRequest);
        gameMasterId = signinResponse.getBody().getId();
        assertEquals(200, signinResponse.getStatusCodeValue());

        // user1
        signupRequest = new SignupRequest();
        signupRequest.setUsername("uname2");
        signupRequest.setEmail("email1234@mail.com");
        signupRequest.setPassword("pass");

        signupResponse = authController.registerUser(signupRequest);
        assertEquals(200, signupResponse.getStatusCodeValue());

        signinRequest = new SigninRequest();
        signinRequest.setUsername("uname2");
        signinRequest.setPassword("pass");

        signinResponse = authController.loginUser(signinRequest);
        user1Id = signinResponse.getBody().getId();
        assertEquals(200, signinResponse.getStatusCodeValue());
    }

    private static void createMap(MapController mapController) {
        ArrayList<Vector> finishLine = new ArrayList<>();
        ArrayList<Vector> startLine = new ArrayList<>();
        ArrayList<Vector> obstacles = new ArrayList<>();
        finishLine.add(new Vector(1, 1));
        startLine.add(new Vector(2, 2));
        obstacles.add(new Vector(5, 5));

        MapStructure mapStructure = new MapStructure(finishLine, startLine, obstacles);

        GameMap gameMap = new GameMap();
        gameMap.setName("super-map");
        gameMap.setUserId(user1Id);
        gameMap.setMapStructure(mapStructure);
        gameMap.setWidth(10);
        gameMap.setHeight(10);

        ResponseEntity<Long> saveMapResponse = mapController.saveMap(gameMap);
        assertEquals(200, saveMapResponse.getStatusCodeValue());
        mapId = saveMapResponse.getBody();
    }

    @BeforeAll
    static void createRoomAndGame(@Autowired GameRoomController gameRoomController,
                                  @Autowired GameRoomRepository gameRoomRepository,
                                  @Autowired AuthController authController,
                                  @Autowired MapController mapController) throws GameRoomNotFoundException {

        createUsers(authController);
        createMap(mapController);

        // create room
        GameRoomRequest gameRoomRequest = new GameRoomRequest();
        gameRoomRequest.setGameMasterId(gameMasterId);
        gameRoomRequest.setMapId(mapId);
        gameRoomRequest.setRoundTime(roundTime);
        gameRoomRequest.setPlayersLimit(playersLimit);

        //when
        ResponseEntity<GameRoomResponse> gameRoomResponse = gameRoomController.createRoom(gameRoomRequest);

        //then

        roomId = gameRoomResponse.getBody().getRoomId();
        assertEquals(200, gameRoomResponse.getStatusCodeValue());
        assertNotNull(gameRoomRepository.findByGameRoomID(roomId));


        // create game

        ResponseEntity<Long> gameIdResponse = gameRoomController.createGame(roomId);
        assertEquals(200, gameIdResponse.getStatusCodeValue());
        assertEquals(roomId, gameIdResponse.getBody().longValue());

    }

    @Test
    void getRoomDetailsTest() throws GameRoomNotFoundException {
        ResponseEntity<GameRoomResponse> gameRoomResponseResponse = gameRoomController.getRoomDetails(roomId);
        GameRoomResponse gameRoomResponse = gameRoomResponseResponse.getBody();
        assertEquals(200, gameRoomResponseResponse.getStatusCodeValue());
        assertEquals(roomId, gameRoomResponse.getRoomId());
        assertEquals(gameMasterId, gameRoomResponse.getGameMasterId());
        assertEquals(roundTime, gameRoomResponse.getRoundTime());
        assertEquals(playersLimit, gameRoomResponse.getPlayersLimit());
    }

    @Test
    void usersListTests() throws GameRoomNotFoundException { // TODO fixme
        ResponseEntity<List<Long>> usersListInRoom = gameRoomController.getUserListInRoom(roomId);
        assertEquals(0, usersListInRoom.getBody().size());

        gameRoomController.joinGameRoom(roomId, gameMasterId);
        usersListInRoom = gameRoomController.getUserListInRoom(roomId);
        assertEquals(1, usersListInRoom.getBody().size());

        gameRoomController.joinGameRoom(roomId, user1Id);
        usersListInRoom = gameRoomController.getUserListInRoom(roomId);
        assertEquals(2, usersListInRoom.getBody().size());

        gameRoomController.leaveGameRoom(roomId, user1Id);
        usersListInRoom = gameRoomController.getUserListInRoom(roomId);
        assertEquals(1, usersListInRoom.getBody().size());
    }
}
