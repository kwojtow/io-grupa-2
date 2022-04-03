package agh.io.iobackend.model;

public class PlayerState {

    private int xCoordinate;
    private int yCoordinate;
    private Vector vector;

    public PlayerState(int xCoordinate, int yCoordinate){
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.vector = new Vector(0,0);
    }

    public void changePlayerVectorAndMove(int xChange, int yChange){
        this.vector.changeVector(xChange, yChange);
        this.makeMove();
    }

    public void makeMove(){
        this.xCoordinate += this.vector.getX();
        this.yCoordinate += this.vector.getY();
    }

}
