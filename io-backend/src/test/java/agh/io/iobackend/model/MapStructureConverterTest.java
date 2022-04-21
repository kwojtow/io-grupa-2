package agh.io.iobackend.model;

import agh.io.iobackend.model.map.MapStructure;
import agh.io.iobackend.model.map.MapStructureConverter;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

class MapStructureConverterTest {

    @Test
    void jsonStringConversionTest() {
        ArrayList<Vector> finishLine = new ArrayList<>();
        ArrayList<Vector> startLine = new ArrayList<>();
        ArrayList<Vector> obstacles = new ArrayList<>();

        finishLine.add(new Vector(1, 1));
        finishLine.add(new Vector(1, 2));
        startLine.add(new Vector(2, 2));
        startLine.add(new Vector(2, 3));
        obstacles.add(new Vector(5, 5));
        obstacles.add(new Vector(5, 6));

        MapStructure mapStructure = new MapStructure(finishLine, startLine, obstacles);

        MapStructureConverter mapStructureConverter = new MapStructureConverter();
        String serializedMap = mapStructureConverter.convertToDatabaseColumn(mapStructure);

        MapStructure mapStructureAfterConversions = mapStructureConverter.convertToEntityAttribute(serializedMap);

        assertArrayEquals(finishLine.toArray(), mapStructureAfterConversions.getFinishLine().toArray());
        assertArrayEquals(startLine.toArray(), mapStructureAfterConversions.getStartLine().toArray());
        assertArrayEquals(obstacles.toArray(), mapStructureAfterConversions.getObstacles().toArray());
    }
}