package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.UserRankResponse;
import agh.io.iobackend.model.User;
import agh.io.iobackend.service.StatisticsService;
import agh.io.iobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<User> getUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    // TODO update User

    @GetMapping("/{userId}/ranks")
    public ResponseEntity<UserRankResponse> getUserRanks(@PathVariable Long userId) {
        UserRankResponse userRankResponse = statisticsService.getUserRanks(userId);
        if (userRankResponse == null) { // there is no data for a given user
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(userRankResponse);
    }
}
