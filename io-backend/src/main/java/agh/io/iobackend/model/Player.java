package agh.io.iobackend.model;

public class Player {

    private final PlayerState playerState;
    private User user;
    private Long playerId;

    // randomly chosen initial coordinates
    public Player(int xCoordinate, int yCoordinate) {
        this.playerState = new PlayerState(xCoordinate, yCoordinate);
    }

    public Player(int xCoordinate, int yCoordinate, User user) {
        this.playerState = new PlayerState(xCoordinate, yCoordinate);
        this.user = user;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void changePlayerState(int xChange, int yChange) {
        playerState.updateVectorAndCoordinates(xChange, yChange);
    }

    public PlayerState getPlayerState() {
        return playerState;
    }
}
