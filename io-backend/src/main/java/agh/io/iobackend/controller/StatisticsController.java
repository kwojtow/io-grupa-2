package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.UserStatsResponse;
import agh.io.iobackend.model.UserDetailsImpl;
import agh.io.iobackend.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/stats")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/users-ranking")
    public void getUsersRanking(){
        // TODO
    }

    @GetMapping("/user")
    public ResponseEntity<UserStatsResponse> getUserStats(){
        Long userId = getCurrentUserId();
        long userWins = statisticsService.getUserWinsNumber(userId);
        long userGames = statisticsService.getUserGamesNumber(userId);
        return ResponseEntity.ok(new UserStatsResponse(userWins, userGames));
    }

    private Long getCurrentUserId() {
        Long userId = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            userId = userDetails.getUserId();
        }
        return userId; // TODO check this implementation
    }
}
