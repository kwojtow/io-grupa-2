package agh.io.iobackend.model;

public class Player {

    private final PlayerState playerState;
    private Long playerId;
    private PlayerStatus playerStatus;


    // randomly chosen initial coordinates
    public Player(int xCoordinate, int yCoordinate, Long userId) {
        this.playerState = new PlayerState(xCoordinate, yCoordinate);
        this.playerId = userId;
        this.playerStatus = PlayerStatus.WAITING;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void updatePlayerAfterMove(int xCoordinate, int yCoordinate, Vector vector, PlayerStatus playerStatus) {
        playerState.updateVectorAndCoordinates(xCoordinate, yCoordinate, vector);
        this.playerStatus = playerStatus;
    }

    public PlayerState getPlayerState() {
        return playerState;
    }

    public PlayerStatus getPlayerStatus(){
        return playerStatus;
    }

    public void setPlayerStatus(PlayerStatus playerStatus){
        this.playerStatus = playerStatus;
    }
}
