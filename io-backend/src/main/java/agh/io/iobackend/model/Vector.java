package agh.io.iobackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Vector {
    private int x;
    private int y;

    public Vector(int x, int y){
        this.x = x;
        this.y = y;
    }
}
