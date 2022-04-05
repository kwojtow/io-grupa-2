package agh.io.iobackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class TestController {
    // TODO remove me after initializing actual files in the controller package

    @GetMapping("/test")
    public String testAuth() {
        return "Test successful";
    }
}
