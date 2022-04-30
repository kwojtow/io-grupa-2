
package agh.io.iobackend.controller;

import agh.io.iobackend.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class GameControllerTest {

    @Autowired
    private GameController gameController;

    @Autowired
    private GameService gameService;

}