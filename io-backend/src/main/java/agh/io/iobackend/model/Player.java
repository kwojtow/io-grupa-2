package agh.io.iobackend.model;

public class Player {

    private PlayerState playerState;
    private Long playerId;
    private User user;

    // randomly chosen coordinates?
    public Player(int xCoordinate, int yCoordinate){
        this.playerState = new PlayerState(xCoordinate, yCoordinate);
    }

//    public Player(int xCoordinate, int yCoordinate, User user){
//        this.playerState = new PlayerState(xCoordinate, yCoordinate);
//        this.user = user;
//    }

    public Long getPlayerId() {
        return playerId;
    }

    public void changePlayerState(int xChange, int yChange){
        this.playerState.changePlayerVectorAndMove(xChange, yChange);
    }
}
