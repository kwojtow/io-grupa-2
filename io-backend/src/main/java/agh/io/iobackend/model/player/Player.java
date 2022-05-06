package agh.io.iobackend.model.player;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@NoArgsConstructor
@Data
public class Player {

    @Column
    private Long playerId;

    private PlayerStatus playerStatus;
    private int xCoordinate;
    private int yCoordinate;
    private int xVector;
    private int yVector;


    private Long id;

    public Player(int xCoordinate, int yCoordinate, Long userId) {
        this.playerId = userId;
        this.playerStatus = PlayerStatus.WAITING;
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.xVector = 0;
        this.yVector = 0;
    }

    public void updatePlayerAfterMove(int xCoordinate, int yCoordinate, int xVector, int yVector, PlayerStatus playerStatus) {
        updateVectorAndCoordinates(xCoordinate, yCoordinate, xVector, yVector);
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

    private void updateVectorAndCoordinates(int xCoordinate, int yCoordinate, int xVector, int yVector){
        this.xVector = xVector;
        this.yVector = yVector;
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
    }

    public int getxCoordinate(){
        return xCoordinate;
    }

    public int getyCoordinate(){
        return yCoordinate;
    }

    public int getxVector() {
        return this.xVector;
    }
    public int getyVector(){
        return yVector;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Id
    public Long getId() {
        return id;
    }
}
