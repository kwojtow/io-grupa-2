package agh.io.iobackend.service;

import agh.io.iobackend.model.user.User;
import agh.io.iobackend.model.user.UserDetailsImpl;
import agh.io.iobackend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public User addUser(User user) {
        return userRepository.save(user);
    }

    public User saveAvatar(Long userId, byte[] avatarBytes) {
        User user = userRepository.findById(userId).get();
        user.setAvatar(avatarBytes);
        return userRepository.save(user);
    }

    public void clearUsers() { // for tests
        userRepository.deleteAll();
    }

    public boolean existsByLogin(String login) {
        return userRepository.existsByLogin(login);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public List<User> getAllUsers() {
        logger.info("get all users");
        return userRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("loadUserByUsername");
        Optional<User> user = userRepository.findByLogin(username);
        user.orElseThrow(() -> new UsernameNotFoundException("Not found: " + username));
        return user.map(UserDetailsImpl::new).get();
    }

    public User getCurrentUser() {
        return userRepository.getById(getCurrentUserId());
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> getUserByLogin(String login) {
        return userRepository.findByLogin(login);
    }

    public Long getCurrentUserId() {
        logger.info("getCurrentUserId");
        Long userId = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            userId = userDetails.getUserId();
        }
        return userId;
    }
}
