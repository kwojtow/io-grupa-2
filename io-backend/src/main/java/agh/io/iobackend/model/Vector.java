package agh.io.iobackend.model;

public class Vector {

    private int x;
    private int y;

    public Vector(int x, int y){
        this.x = x;
        this.y = y;
    }

    public void changeVector(int xChange, int yChange){
        this.x += xChange;
        this.y += yChange;
    }

    public int getX(){
        return x;
    }

    public int getY() {
        return y;
    }
}
