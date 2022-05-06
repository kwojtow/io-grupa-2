
package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.auth.JwtResponse;
import agh.io.iobackend.controller.payload.auth.SigninRequest;
import agh.io.iobackend.controller.payload.auth.SignupRequest;
import agh.io.iobackend.controller.payload.game.PlayerInitialCoord;
import agh.io.iobackend.controller.payload.game.PlayerStateResponse;
import agh.io.iobackend.controller.payload.room.GameRoomRequest;
import agh.io.iobackend.controller.payload.room.GameRoomResponse;
import agh.io.iobackend.exceptions.GameRoomNotFoundException;
import agh.io.iobackend.exceptions.NoGameFoundException;
import agh.io.iobackend.model.Vector;
import agh.io.iobackend.model.game.Game;
import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.MapStructure;
import agh.io.iobackend.model.player.PlayerStatus;
import agh.io.iobackend.repository.GameRepository;
import agh.io.iobackend.repository.GameRoomRepository;
import agh.io.iobackend.service.GameService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@SpringBootTest
public class GameControllerTest {

    @Autowired
    private GameController gameController;

    @Autowired
    private GameService gameService;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GameRoomController gameRoomController;

    @Autowired
    private GameRoomRepository gameRoomRepository;

    private static Long roomId;
    private static Long mapId = 1L;
    private static Long gameMasterId;
    private static Integer roundTime = 4;
    private static Integer playersLimit = 2;
    private static Long user1Id;

    private static Long gameId;

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
                                  @Autowired MapController mapController,
                                  @Autowired GameService gameService) throws GameRoomNotFoundException, NoGameFoundException {

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

        // add users
        gameRoomController.joinGameRoom(roomId, user1Id);
        gameRoomController.joinGameRoom(roomId,  gameMasterId);

        // create game

        ResponseEntity<Long> gameIdResponse = gameRoomController.createGame(roomId);
        gameId = gameIdResponse.getBody();
        assertEquals(200, gameIdResponse.getStatusCodeValue());
        assertEquals(roomId, gameIdResponse.getBody().longValue());
    }

    @Test
    public void setInitialCoordinatesWithStartGame(){
        //given
        ArrayList<PlayerInitialCoord> playerInitialCoordArrayList = new ArrayList<>();

        PlayerInitialCoord playerInitialCoord1 = new PlayerInitialCoord();
        int x1 = 1, y1 = 1;
        playerInitialCoord1.setUserId(user1Id);
        playerInitialCoord1.setXCoord(x1);
        playerInitialCoord1.setYCoord(y1);
        playerInitialCoordArrayList.add(playerInitialCoord1);

        PlayerInitialCoord playerInitialCoord2 = new PlayerInitialCoord();
        int x2 = 4; int y2 = 4;
        playerInitialCoord2.setUserId(gameMasterId);
        playerInitialCoord2.setXCoord(x2);
        playerInitialCoord2.setYCoord(y2);
        playerInitialCoordArrayList.add(playerInitialCoord2);

        PlayerStateResponse expectedPlayerStateResponse1 = new PlayerStateResponse();
        expectedPlayerStateResponse1.setPlayerId(user1Id);
        expectedPlayerStateResponse1.setXCoordinate(x1);
        expectedPlayerStateResponse1.setYCoordinate(y1);
        expectedPlayerStateResponse1.setPlayerStatus(PlayerStatus.PLAYING);

        PlayerStateResponse expectedPlayerStateResponse2 = new PlayerStateResponse();
        expectedPlayerStateResponse2.setPlayerId(gameMasterId);
        expectedPlayerStateResponse2.setXCoordinate(x2);
        expectedPlayerStateResponse2.setYCoordinate(y2);
        expectedPlayerStateResponse2.setPlayerStatus(PlayerStatus.WAITING);

        //when
        gameController.startGame(playerInitialCoordArrayList, gameId);
        ResponseEntity<ArrayList<PlayerStateResponse>> playerStates = gameController.getGameState(gameId);

        //then
        ResponseEntity<Long> gameIdResponse = gameRoomController.checkIfGameStarted(roomId);
        assertEquals(gameIdResponse.getBody(), gameId);
        assertEquals(playerStates.getBody().get(0), expectedPlayerStateResponse1); // ta lista jest pusta
        assertEquals(playerStates.getBody().get(1), expectedPlayerStateResponse2);

    }

    @Test
    public void makeMoveAndGetGameState(){

    }



    @Test
    public void endGame(){

    }


}


