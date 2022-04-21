package agh.io.iobackend.model;


import org.springframework.data.util.Pair;

public class PlayerState {

    private int xCoordinate;
    private int yCoordinate;
    private Vector vector;

    public PlayerState(int xCoordinate, int yCoordinate){
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.vector = new Vector(0,0);
    }

    public void updateVectorAndCoordinates(int xCoordinate, int yCoordinate, Vector vector){
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
