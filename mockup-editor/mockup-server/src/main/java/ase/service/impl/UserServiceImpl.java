package ase.service.impl;

import ase.DAO.DAOException;
import ase.DAO.UserDAO;
import ase.DTO.User;
import ase.Security.JwtProvider;
import ase.message.response.JwtResponse;
import ase.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
/**
 * @author Matthias Deimel
 */
@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtProvider jwtProvider;
    @Autowired
    private UserDAO userDAO;
    private HashMap<String, String> loggedInUserToken = new HashMap<>();

    @Override
    public JwtResponse login(String email, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtProvider.generateJwtToken(authentication);

            loggedInUserToken.put(email, jwt);

            return new JwtResponse(jwt, userDAO.findByEmail(email).getUsername(), email);

        } catch (DAOException e) {
            logger.error("UserService: can not read from Database");
        }
        return null;
    }

    @Override
    public boolean logout(String email) {
        logger.error("LOGOUT:" + email);
        return loggedInUserToken.remove(email) != null;
    }

    @Override
    public boolean isLoggedIn(String email) {
        if (loggedInUserToken.containsKey(email)) {
            String token = loggedInUserToken.get(email);
            return jwtProvider.validateJwtToken(token);
        }
        return false;
    }

    @Override
    public boolean register(User user) {
        System.out.println("Attempt to register:" + user.toString());
        try {
            userDAO.create(user);
            return true;
        } catch (DAOException e) {
            logger.error("UserService: can not create User");
        }
        return false;
    }

    @Override
    public User findUserByID(int id) {
        try {
            return userDAO.findById(id);
        } catch (DAOException e) {
            return null;
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        try {
            if (userDAO.findByEmail(email) != null) {
                return true;
            }
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public User getUserByEmail(String email) {
        try {
            return userDAO.findByEmail(email);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public String getToken(String username) {
        return this.loggedInUserToken.getOrDefault(username, null);
    }

    @Override
    public void setToken(String username, String newToken) {
        this.loggedInUserToken.put(username, newToken);
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        if (!this.existsByEmail(s)) {
            throw new UsernameNotFoundException("Email: " + s + " not found");
        }
        return ase.Security.UserDetails.build(this.getUserByEmail(s));
    }
}
