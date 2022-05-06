package agh.io.iobackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vector {

    private int x;
    private int y;
    private Long id;

    public Vector(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void changeVector(int xChange, int yChange) {
        this.x += xChange;
        this.y += yChange;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Id
    public Long getId() {
        return id;
    }
}
