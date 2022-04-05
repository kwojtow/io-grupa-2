package agh.io.iobackend.controller.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {

    private String token;
    private final String type = "Bearer";
    private Long id;
    private String username;

}
