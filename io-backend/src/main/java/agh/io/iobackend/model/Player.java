package agh.io.iobackend.model;

public class Player {

    private final PlayerState playerState;
    private Long playerId;

    // randomly chosen initial coordinates
    public Player(int xCoordinate, int yCoordinate, Long userId) {
        this.playerState = new PlayerState(xCoordinate, yCoordinate);
        this.playerId = userId;
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
