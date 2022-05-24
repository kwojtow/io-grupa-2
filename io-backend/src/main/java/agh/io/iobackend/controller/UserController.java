package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.stats.UserRankResponse;
import agh.io.iobackend.model.user.User;
import agh.io.iobackend.service.StatisticsService;
import agh.io.iobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private UserService userService;

    @CrossOrigin
    @GetMapping
    public ResponseEntity<User> getUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @CrossOrigin
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId){
        return ResponseEntity.ok(userService.getUserById(userId).get());
    }

    @PostMapping("/{userId}")
    public ResponseEntity<User> saveAvatar(@PathVariable Long userId, @RequestPart("imageFile") MultipartFile file) throws IOException {
        return ResponseEntity.ok().body(userService.saveAvatar(userId, file.getBytes()));
    }

    // TODO update User

    @CrossOrigin
    @GetMapping("/{userId}/ranks")
    public ResponseEntity<UserRankResponse> getUserRanks(@PathVariable Long userId) {
        UserRankResponse userRankResponse = statisticsService.getUserRanks(userId);
        if (userRankResponse == null) { // there is no data for a given user
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(userRankResponse);
    }
}