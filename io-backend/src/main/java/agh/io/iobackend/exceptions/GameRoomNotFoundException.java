package agh.io.iobackend.exceptions;

public class GameRoomNotFoundException extends Exception {
    public GameRoomNotFoundException(String errorMsg) {
        super(errorMsg);
    }
}
