package agh.io.iobackend.controller.payload;

import lombok.Data;

@Data
public class MoveRequest {

        private Long gameId;

        private Long playerId;

        private int xChange;

        private int yChange;
}
