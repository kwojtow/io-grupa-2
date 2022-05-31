package agh.io.iobackend.controller.payload.stats;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRankResponse {
    private int rankingPosition;
    private int points;
}
