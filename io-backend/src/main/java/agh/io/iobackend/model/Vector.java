package agh.io.iobackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vector {

    private int x;
    private int y;

    public void changeVector(int xChange, int yChange) {
        this.x += xChange;
        this.y += yChange;
    }
}
