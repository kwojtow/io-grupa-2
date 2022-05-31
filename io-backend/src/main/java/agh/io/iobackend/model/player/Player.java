package agh.io.iobackend.model.player;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Player {

    @Id
    @GeneratedValue
    private Long id;

    private Long playerId;

    private PlayerStatus playerStatus;
    private int xCoordinate;
    private int yCoordinate;
    private int xVector;
    private int yVector;


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

    public Boolean checkPlayerResult() {
        return playerStatus != PlayerStatus.LOST;
    }

    public Boolean checkIfWinner() { return playerStatus == PlayerStatus.WON; }

    public PlayerStatus getPlayerStatus() {
        return playerStatus;
    }

    public void setPlayerStatus(PlayerStatus playerStatus) {
        this.playerStatus = playerStatus;
    }

    private void updateVectorAndCoordinates(int xCoordinate, int yCoordinate, int xVector, int yVector) {
        this.xVector = xVector;
        this.yVector = yVector;
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
    }

}