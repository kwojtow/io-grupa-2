package agh.io.iobackend.model.map;

import agh.io.iobackend.model.Vector;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MapStructure {

    private ArrayList<Vector> finishLine;
    private ArrayList<Vector> startLine;
    private ArrayList<Vector> obstacles;

}
