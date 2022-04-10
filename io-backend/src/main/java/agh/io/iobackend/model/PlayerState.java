package agh.io.iobackend.model;


import org.springframework.data.util.Pair;

public class PlayerState {

    private int xCoordinate;
    private int yCoordinate;
    private final Vector vector;

    public PlayerState(int xCoordinate, int yCoordinate){
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.vector = new Vector(0,0);
    }

    public void updateVectorAndCoordinates(int xChange, int yChange){
        this.vector.changeVector(xChange, yChange);
        this.updateCoordinates();
    }

    public void updateCoordinates(){
        this.xCoordinate += this.vector.getX();
        this.yCoordinate += this.vector.getY();
    }

    public Pair<Integer, Integer> getPlayerPosition(){
        return Pair.of(xCoordinate, yCoordinate);
    }
}
