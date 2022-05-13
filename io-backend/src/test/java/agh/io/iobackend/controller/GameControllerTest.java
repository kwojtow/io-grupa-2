package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.auth.JwtResponse;
import agh.io.iobackend.controller.payload.auth.SigninRequest;
import agh.io.iobackend.controller.payload.auth.SignupRequest;
import agh.io.iobackend.controller.payload.game.PlayerInitialCoord;
import agh.io.iobackend.controller.payload.game.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.game.PlayerStateResponse;
import agh.io.iobackend.controller.payload.room.GameRoomRequest;
import agh.io.iobackend.controller.payload.room.GameRoomResponse;
import agh.io.iobackend.exceptions.GameRoomNotFoundException;
import agh.io.iobackend.exceptions.NoGameFoundException;
import agh.io.iobackend.model.Vector;
import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.MapStructure;
import agh.io.iobackend.model.player.PlayerStatus;
import agh.io.iobackend.repository.GameRoomRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class GameControllerTest {

    @Autowired
    private GameController gameController;

    @Autowired
    private GameRoomController gameRoomController;

    private static Long roomId;
    private static Long mapId = 1L;
    private static Long gameMasterId;
    private static Integer roundTime = 4;
    private static Integer playersLimit = 2;
    private static Long user1Id;

    private static Long gameId;

    static int x1 = 1;
    static int y1 = 1;
    static int x2 = 4;
    static int y2 = 4;


    private static void createUsers(AuthController authController) {

        // user - gameMaster
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("uname1");
        signupRequest.setEmail("email12345@mail.com");
        signupRequest.setPassword("pass");

        ResponseEntity<String> signupResponse = authController.registerUser(signupRequest);
        assertEquals(200, signupResponse.getStatusCodeValue());

        SigninRequest signinRequest = new SigninRequest();
        signinRequest.setUsername("uname1");
        signinRequest.setPassword("pass");

        ResponseEntity<JwtResponse> signinResponse = authController.loginUser(signinRequest);
        gameMasterId = signinResponse.getBody().getId();
        assertEquals(200, signinResponse.getStatusCodeValue());

        // user1
        signupRequest = new SignupRequest();
        signupRequest.setUsername("uname11");
        signupRequest.setEmail("email123456@mail.com");
        signupRequest.setPassword("pass");

        signupResponse = authController.registerUser(signupRequest);
        assertEquals(200, signupResponse.getStatusCodeValue());

        signinRequest = new SigninRequest();
        signinRequest.setUsername("uname11");
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
                                  @Autowired GameController gameController,
                                  @Autowired AuthController authController,
                                  @Autowired MapController mapController) throws GameRoomNotFoundException, NoGameFoundException {

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
        gameRoomController.joinGameRoom(roomId, gameMasterId);
        gameRoomController.joinGameRoom(roomId, user1Id);

        // create game

        ResponseEntity<Long> gameIdResponse = gameRoomController.createGame(roomId);
        gameId = gameIdResponse.getBody();
        assertEquals(200, gameIdResponse.getStatusCodeValue());

        ArrayList<PlayerInitialCoord> playerInitialCoordArrayList = new ArrayList<>();

        PlayerInitialCoord playerInitialCoord1 = new PlayerInitialCoord();
        playerInitialCoord1.setUserId(user1Id);
        playerInitialCoord1.setXCoord(x1);
        playerInitialCoord1.setYCoord(y1);
        playerInitialCoordArrayList.add(playerInitialCoord1);

        PlayerInitialCoord playerInitialCoord2 = new PlayerInitialCoord();
        playerInitialCoord2.setUserId(gameMasterId);
        playerInitialCoord2.setXCoord(x2);
        playerInitialCoord2.setYCoord(y2);
        playerInitialCoordArrayList.add(playerInitialCoord2);

        gameController.startGame(playerInitialCoordArrayList, gameId);
    }

    @Test
    @Order(1)
    public void setInitialCoordinatesWithStartGame() {
        //given
        PlayerStateResponse expectedPlayerStateResponse1 = new PlayerStateResponse();
        expectedPlayerStateResponse1.setPlayerId(user1Id);
        expectedPlayerStateResponse1.setXCoordinate(x1);
        expectedPlayerStateResponse1.setYCoordinate(y1);
        expectedPlayerStateResponse1.setVector(new Vector(0, 0));
        expectedPlayerStateResponse1.setPlayerStatus(PlayerStatus.PLAYING);

        PlayerStateResponse expectedPlayerStateResponse2 = new PlayerStateResponse();
        expectedPlayerStateResponse2.setPlayerId(gameMasterId);
        expectedPlayerStateResponse2.setXCoordinate(x2);
        expectedPlayerStateResponse2.setYCoordinate(y2);
        expectedPlayerStateResponse2.setVector(new Vector(0, 0));
        expectedPlayerStateResponse2.setPlayerStatus(PlayerStatus.WAITING);

        //when
        ResponseEntity<ArrayList<PlayerStateResponse>> playerStates = gameController.getGameState(gameId);

        //then
        ResponseEntity<Long> gameIdResponse = gameRoomController.checkIfGameStarted(roomId);
        assertEquals(gameId, gameIdResponse.getBody());
        assertEquals(expectedPlayerStateResponse1, playerStates.getBody().get(0));
        assertEquals(expectedPlayerStateResponse2, playerStates.getBody().get(1));

    }

    @Test
    @Order(2)
    public void makeMoveAndGetGameState() {
        //given
        PlayerMoveRequest playerMoveRequest = new PlayerMoveRequest();
        playerMoveRequest.setPlayerId(user1Id);
        playerMoveRequest.setPlayerStatus(PlayerStatus.WAITING); // frontend part changes it to WAITING?
        playerMoveRequest.setVector(new Vector(1, 1));
        playerMoveRequest.setXCoordinate(x1 + 1);
        playerMoveRequest.setYCoordinate(y1 + 1);

        PlayerStateResponse expectedPlayerStateResponse = new PlayerStateResponse();
        expectedPlayerStateResponse.setPlayerId(user1Id);
        expectedPlayerStateResponse.setXCoordinate(x1 + 1);
        expectedPlayerStateResponse.setYCoordinate(y1 + 1);
        expectedPlayerStateResponse.setVector(new Vector(1, 1));
        expectedPlayerStateResponse.setPlayerStatus(PlayerStatus.WAITING);

        PlayerStateResponse expectedPlayerStateResponseForGameMaster = new PlayerStateResponse();
        expectedPlayerStateResponseForGameMaster.setPlayerId(gameMasterId);
        expectedPlayerStateResponseForGameMaster.setXCoordinate(x2);
        expectedPlayerStateResponseForGameMaster.setYCoordinate(y2);
        expectedPlayerStateResponseForGameMaster.setVector(new Vector(0, 0));
        expectedPlayerStateResponseForGameMaster.setPlayerStatus(PlayerStatus.PLAYING);

        //when
        ResponseEntity<String> responseEntity = gameController.changePosition(playerMoveRequest, gameId); //user1 made move
        ResponseEntity<ArrayList<PlayerStateResponse>> playerStates = gameController.getGameState(gameId);

        //then
        assertEquals(expectedPlayerStateResponse, playerStates.getBody().get(0));
        assertEquals(expectedPlayerStateResponseForGameMaster, playerStates.getBody().get(1)); //getting the game state (GameMaster's status should be set as playing)
    }

    @Test
    @Order(3)
    public void playersQueueWorksFine() {
        //given - now the gameMater is moving
        PlayerMoveRequest playerMoveRequest = new PlayerMoveRequest();
        playerMoveRequest.setPlayerId(gameMasterId);
        playerMoveRequest.setPlayerStatus(PlayerStatus.WAITING);
        playerMoveRequest.setVector(new Vector(1, 0));
        playerMoveRequest.setXCoordinate(x2 + 1);
        playerMoveRequest.setYCoordinate(y2);

        PlayerStateResponse expectedPlayerStateResponse = new PlayerStateResponse();
        expectedPlayerStateResponse.setPlayerId(gameMasterId);
        expectedPlayerStateResponse.setXCoordinate(x2 + 1);
        expectedPlayerStateResponse.setYCoordinate(y2);
        expectedPlayerStateResponse.setVector(new Vector(1, 0));
        expectedPlayerStateResponse.setPlayerStatus(PlayerStatus.WAITING);

        PlayerStateResponse expectedPlayerStateResponseForPlayingUser = new PlayerStateResponse();
        expectedPlayerStateResponseForPlayingUser.setPlayerId(user1Id);
        expectedPlayerStateResponseForPlayingUser.setXCoordinate(x1 + 1);
        expectedPlayerStateResponseForPlayingUser.setYCoordinate(y1 + 1);
        expectedPlayerStateResponseForPlayingUser.setVector(new Vector(1, 1));
        expectedPlayerStateResponseForPlayingUser.setPlayerStatus(PlayerStatus.PLAYING);

        //when
        ResponseEntity<String> responseEntity = gameController.changePosition(playerMoveRequest, gameId); //user1 made move
        ResponseEntity<ArrayList<PlayerStateResponse>> playerStates = gameController.getGameState(gameId);

        //then
        assertEquals(expectedPlayerStateResponseForPlayingUser, playerStates.getBody().get(0));
    }

    @Test
    @Order(4)
    public void endGame() {
        //given
        PlayerMoveRequest playerMoveRequest = new PlayerMoveRequest();
        playerMoveRequest.setPlayerId(gameMasterId);
        playerMoveRequest.setPlayerStatus(PlayerStatus.WAITING);
        playerMoveRequest.setVector(new Vector(1, 0));
        playerMoveRequest.setXCoordinate(x2 + 1);
        playerMoveRequest.setYCoordinate(y2);

        //when
        ResponseEntity<String> responseEntity = gameController.endGame(gameId);
        ResponseEntity<ArrayList<PlayerStateResponse>> gettingGameState = gameController.getGameState(gameId);
        ResponseEntity<String> changingPosition = gameController.changePosition(playerMoveRequest, gameId);

        //then
        assertEquals(400, gettingGameState.getStatusCodeValue());
        assertEquals(400, changingPosition.getStatusCodeValue());
    }
}