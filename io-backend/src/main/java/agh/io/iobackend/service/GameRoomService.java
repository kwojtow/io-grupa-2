package agh.io.iobackend.service;

import agh.io.iobackend.exceptions.GameRoomNotFoundException;
import agh.io.iobackend.model.GameRoom;
import agh.io.iobackend.repository.GameRoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GameRoomService {

    private static final Logger logger = LoggerFactory.getLogger(GameRoomService.class);

    @Autowired
    private GameRoomRepository gameRoomRepository;

    public GameRoom createGameRoom(GameRoom gameRoom) {
        return gameRoomRepository.save(gameRoom);
    }

    public void deleteGameRoom(Long gameRoomID) throws GameRoomNotFoundException {
        Optional<GameRoom> gameRoom2Trash = gameRoomRepository.findByGameRoomID(gameRoomID);
        if (gameRoom2Trash.isPresent()) {
            gameRoomRepository.delete(gameRoom2Trash.get());
        }
        else {
            throw new GameRoomNotFoundException(
                    "Can not delete game room " + gameRoomID.toString() + ", it does not exist!"
            );
        }
    }

    public void clearGameRooms(){ // for tests
        gameRoomRepository.deleteAll();
    }

//    public void deleteGameRoom(String roomCode) throws GameRoomNotFoundException {
//        Optional<GameRoom> gameRoom2Trash = gameRoomRepository.findByRoomCode(roomCode);
//        if (gameRoom2Trash.isPresent()) {
//            gameRoomRepository.delete(gameRoom2Trash.get());
//        }
//        else {
//            throw new GameRoomNotFoundException(
//                    "Can not delete game room with code " + roomCode + ", it does not exist!"
//            );
//        }
//    }

    public GameRoom getGameRoom(Long id) throws GameRoomNotFoundException {
        logger.info("get game room");
        Optional<GameRoom> gameRoom = gameRoomRepository.findByGameRoomID(id);
        if (gameRoom.isPresent()) {
            return gameRoom.get();
        }
        else {
            throw new GameRoomNotFoundException(
                    "Cannot find the room"
            );
        }

    }
}
