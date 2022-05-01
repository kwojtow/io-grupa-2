package agh.io.iobackend.model.player;

import agh.io.iobackend.model.Vector;
import org.springframework.data.util.Pair;

public class Player {

    private Long playerId;

    private PlayerStatus playerStatus;
    private int xCoordinate;
    private int yCoordinate;

    private Vector vector;

    public Player(int xCoordinate, int yCoordinate, Long userId) {
        this.playerId = userId;
        this.playerStatus = PlayerStatus.WAITING;
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.vector = new Vector(0,0);
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void updatePlayerAfterMove(int xCoordinate, int yCoordinate, Vector vector, PlayerStatus playerStatus) {
        updateVectorAndCoordinates(xCoordinate, yCoordinate, vector);
        this.playerStatus = playerStatus;
    }

    public Boolean getPlayerResult(){
        return playerStatus != PlayerStatus.LOST;
    }

    public PlayerStatus getPlayerStatus(){
        return playerStatus;
    }

    public void setPlayerStatus(PlayerStatus playerStatus){
        this.playerStatus = playerStatus;
    }

    private void updateVectorAndCoordinates(int xCoordinate, int yCoordinate, Vector vector){
        this.vector = vector;
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
    }

    public Pair<Integer, Integer> getPlayerPosition(){
        return Pair.of(xCoordinate, yCoordinate);
    }

    public int getxCoordinate(){
        return xCoordinate;
    }

    public int getyCoordinate(){
        return yCoordinate;
    }
}
