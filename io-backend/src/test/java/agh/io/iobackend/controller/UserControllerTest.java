package agh.io.iobackend.controller;

import agh.io.iobackend.controller.payload.JwtResponse;
import agh.io.iobackend.controller.payload.SigninRequest;
import agh.io.iobackend.controller.payload.SignupRequest;
import agh.io.iobackend.model.User;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
class UserControllerTest {

    private static final String username = "user";
    private static final String email = "email@gmail.com";
    private static final String password = "pass";
    private static String token;

    @Autowired
    private UserController userController;

    @BeforeAll
    static void registerAndLogin(@Autowired AuthController authController) {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername(username);
        signupRequest.setEmail(email);
        signupRequest.setPassword(password);

        ResponseEntity<String> signupResponse = authController.registerUser(signupRequest);
        assertEquals(signupResponse.getStatusCodeValue(), 200);

        SigninRequest signinRequest = new SigninRequest();
        signinRequest.setUsername(username);
        signinRequest.setPassword(password);

        ResponseEntity<JwtResponse> signinResponse = authController.loginUser(signinRequest);
        token = signinResponse.getBody().getToken();
        assertEquals(signinResponse.getStatusCodeValue(), 200);
        assertFalse(token.isEmpty());
    }

    @Test
    void testGetUser() {
        User user = userController.getUser().getBody();
        assertEquals(username, user.getLogin());
        assertEquals(email, user.getEmail());
    }
}