package agh.io.iobackend.model.map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.AttributeConverter;
import java.io.IOException;

public class MapStructureConverter implements AttributeConverter<MapStructure, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(MapStructure mapStructure) {
        String map = null;
        try {
            map = objectMapper.writeValueAsString(mapStructure);
        } catch (JsonProcessingException e) {
            System.out.println("JSON writing error " + e);
        }
        return map;
    }

    @Override
    public MapStructure convertToEntityAttribute(String stringMap) {
        MapStructure mapStructure = null;
        try {
            mapStructure = objectMapper.readValue(stringMap, MapStructure.class);
        } catch (final IOException e) {
            System.out.println("JSON reading error " + e);
        }
        return mapStructure;
    }

}