//package agh.io.iobackend.controller;
//
//import agh.io.iobackend.controller.payload.GameRoomRequest;
//import agh.io.iobackend.repository.GameRoomRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//
//
//@SpringBootTest
//public class GameRoomControllerTest {
//
//    @Autowired
//    private GameRoomController gameRoomController;
//
//    @Autowired
//    private GameRoomRepository gameRoomRepository;
//
//
//    @Test
//    public void createRoom(){
//
//        GameRoomRequest gameRoomRequest = new GameRoomRequest();
//        gameRoomRequest.setGameMasterId(1L);
//        gameRoomRequest.setMapId(1L);
//        gameRoomRequest.setRoundTime(4);
//        gameRoomRequest.setPlayersLimit(2);
//
//        //when
//        gameRoomController.createRoom(gameRoomRequest);
//
//        //then
//        assertNotNull(gameRoomRepository.findByGameRoomID(1L));
//
//    }
//}
