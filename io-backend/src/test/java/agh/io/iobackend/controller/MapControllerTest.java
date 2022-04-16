package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.JwtResponse;
import agh.io.iobackend.controller.payload.SigninRequest;
import agh.io.iobackend.controller.payload.SignupRequest;
import agh.io.iobackend.model.Vector;
import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.MapStructure;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
class MapControllerTest {

    @Autowired
    private MapController mapController;

    private static final String username = "great-user";
    private static final String email = "email-great@gmail.com";
    private static final String password = "pass";
    private static String token;
    private static Long userId;

    @BeforeAll
    static void registerAndLogin(@Autowired AuthController authController) {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername(username);
        signupRequest.setEmail(email);
        signupRequest.setPassword(password);

        ResponseEntity<String> signupResponse = authController.registerUser(signupRequest);
        assertEquals(200, signupResponse.getStatusCodeValue());

        SigninRequest signinRequest = new SigninRequest();
        signinRequest.setUsername(username);
        signinRequest.setPassword(password);

        ResponseEntity<JwtResponse> signinResponse = authController.loginUser(signinRequest);
        token = signinResponse.getBody().getToken();
        userId = signinResponse.getBody().getId();
        assertEquals(200, signinResponse.getStatusCodeValue());
        assertFalse(token.isEmpty());
    }

    @Test
    void mapSaveAndGetTest() {
        ArrayList<Vector> finishLine = new ArrayList<>();
        ArrayList<Vector> startLine = new ArrayList<>();
        ArrayList<Vector> obstacles = new ArrayList<>();
        finishLine.add(new Vector(1, 1));
        startLine.add(new Vector(2, 2));
        obstacles.add(new Vector(5, 5));

        MapStructure mapStructure = new MapStructure(finishLine, startLine, obstacles);

        GameMap gameMap = new GameMap();
        gameMap.setName("super-map");
        gameMap.setUserId(userId);
        gameMap.setMapStructure(mapStructure);

        ResponseEntity<Long> saveMapResponse = mapController.saveMap(gameMap);
        assertEquals(200, saveMapResponse.getStatusCodeValue());
        Long mapId = saveMapResponse.getBody();

        ResponseEntity<GameMap> gameMapResponse = mapController.getMapById(mapId);
        assertEquals(200, gameMapResponse.getStatusCodeValue());
        GameMap mapResponse = gameMapResponse.getBody();
        assertEquals(gameMap.getMapId(), mapResponse.getMapId());
        assertEquals(gameMap.getName(), mapResponse.getName());
        assertEquals(gameMap.getUserId(), mapResponse.getUserId());

        ResponseEntity<List<GameMap>> userMapsResponse = mapController.getMaps();
        assertEquals(200, userMapsResponse.getStatusCodeValue());
        List<GameMap> userMaps = userMapsResponse.getBody();
        assertEquals(1, userMaps.size());
        assertEquals(gameMap.getName(), userMaps.get(0).getName());
        assertEquals(gameMap.getMapId(), userMaps.get(0).getMapId());
        assertEquals(gameMap.getUserId(), userMaps.get(0).getUserId());
    }
}