package agh.io.iobackend.controller.payload.stats;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatsResponse {
    private long userWins;
    private long userGames;
}

