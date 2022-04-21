package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.JwtResponse;
import agh.io.iobackend.controller.payload.SigninRequest;
import agh.io.iobackend.controller.payload.SignupRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthControllerTest {

    @Autowired
    private AuthController authController;

    @Test
    void registrationAndLoginTest(){
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("username");
        signupRequest.setEmail("super-email@gmail.com");
        signupRequest.setPassword("super-secret");

        ResponseEntity<String> signupResponse = authController.registerUser(signupRequest);
        assertEquals(signupResponse.getStatusCodeValue(), 200);

        SigninRequest signinRequest = new SigninRequest();
        signinRequest.setUsername("username");
        signinRequest.setPassword("super-secret");

        ResponseEntity<JwtResponse> signinResponse = authController.loginUser(signinRequest);
        String token = signinResponse.getBody().getToken();
        assertEquals(signinResponse.getStatusCodeValue(), 200);
        assertFalse(token.isEmpty());

        SigninRequest incorrectSigninRequest = new SigninRequest();
        incorrectSigninRequest.setUsername("not-existing-user");
        incorrectSigninRequest.setPassword("secret");
        assertThrows(BadCredentialsException.class, () -> authController.loginUser(incorrectSigninRequest));
    }
}