package agh.io.iobackend.controller.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class MoveRequest {

        private Long gameId;

        private Long playerId;

        private Integer xChange;

        private Integer yChange;

        // ta zmiana pozycji to tez moze byc jakis enum, cokolwiek, na razie tak najprosciej
}
