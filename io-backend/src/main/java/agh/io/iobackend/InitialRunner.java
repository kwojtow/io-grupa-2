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

    }
}