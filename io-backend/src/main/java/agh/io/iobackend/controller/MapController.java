package agh.io.iobackend.controller;

import agh.io.iobackend.model.GameMap;
import agh.io.iobackend.model.User;
import agh.io.iobackend.model.UserDetailsImpl;
import agh.io.iobackend.service.MapService;
import agh.io.iobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("/maps")
public class MapController {

    @Autowired
    private MapService mapService;

    @Autowired
    private UserService userService;

    @GetMapping("/byuser")
    public List<GameMap> getMapsCreatedByUser(){
        return mapService.getMapsCreatedByUser(getCurrentUserId());
    }

    public void getMapsWithTheMostWinsForUser(){
        // TODO
    }

    public void getMapsWithTheMostGamesForUser(){
        // TODO
    }


    // TODO getMapRanking

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
