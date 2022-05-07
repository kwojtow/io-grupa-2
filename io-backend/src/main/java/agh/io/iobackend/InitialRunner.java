package agh.io.iobackend;


import agh.io.iobackend.model.Vector;
import agh.io.iobackend.model.game.Game;
import agh.io.iobackend.model.game.GameRoom;
import agh.io.iobackend.model.map.GameMap;
import agh.io.iobackend.model.map.MapStructure;
import agh.io.iobackend.model.user.User;
import agh.io.iobackend.service.GameRoomService;
import agh.io.iobackend.service.GameService;
import agh.io.iobackend.service.MapService;
import agh.io.iobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class InitialRunner implements CommandLineRunner {
    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private MapService mapService;

    @Autowired
    private UserService userService;

    @Autowired
    GameRoomService gameRoomService;

    @Autowired
    GameService gameService;


    @Override
    public void run(String... args) throws Exception {
        User user = User.builder()
                .email("test@test.pl")
                .password(encoder.encode("testtest"))
                .login("test")
                .build();
        userService.addUser(user);

        User user2 = User.builder()
                .email("test2@test2.pl")
                .password(encoder.encode("testtest"))
                .login("test2")
                .build();
        userService.addUser(user2);

        MapStructure mapStructure = new MapStructure();
        ArrayList<Vector> startLine = new ArrayList<>();
        ArrayList<Vector> finishLine = new ArrayList<>();
        ArrayList<Vector> obstacles = new ArrayList<>();

        startLine.add(new Vector(1, 2));
        startLine.add(new Vector(2, 2));

        finishLine.add(new Vector(10, 2));
        finishLine.add(new Vector(20, 2));

        obstacles.add(new Vector(5, 5));
        obstacles.add(new Vector(6, 6));
        obstacles.add(new Vector(7, 7));

        mapStructure.setStartLine(startLine);
        mapStructure.setFinishLine(finishLine);
        mapStructure.setObstacles(obstacles);

        GameMap gameMap = GameMap.builder()
                .userId(user.getUserId())
                .height(20)
                .width(30)
                .mapStructure(mapStructure)
                .build();

        mapService.saveMap(gameMap);

        GameRoom gameRoom = new GameRoom(gameMap, 5, 5, user2.getUserId());

        gameRoomService.createGameRoom(gameRoom);

        Game game = new Game(gameRoom.getGameRoomID(), gameMap.getMapId(), user2.getUserId());

        gameService.createGame(gameRoom);

        System.out.println("User id: " + user.getUserId());
        System.out.println(user);
        System.out.println("User id: " + user2.getUserId());
        System.out.println(user2);
        System.out.println("Map id: " + gameMap.getMapId());
        System.out.println("Game room id: " + gameRoom.getGameRoomID());

    }
}