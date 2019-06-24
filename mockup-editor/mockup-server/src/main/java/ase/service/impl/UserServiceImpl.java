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
import java.util.List;

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

    /**
     * login for a user, identified by email and a password,
     * if the user is already registered, a JwtResponse is returned
     *
     * @param  email    String
     * @param  password String
     * @return          JwtResponse
     */
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
    /**
     * logs out a user, identified by his / her email address,
     * returns true, if the action succeded
     * otherwise false (i.e. when the user was not logged in prev.)
     * @param  email String
     * @return       boolean
     */
    @Override
    public boolean logout(String email) {
        logger.error("LOGOUT:" + email);
        return loggedInUserToken.remove(email) != null;
    }

    /**
     * Assertion for wether a user, identified by his/ her email, is logged in
     * @param  email String
     * @return       boolean
     */
    @Override
    public boolean isLoggedIn(String email) {
        if (loggedInUserToken.containsKey(email)) {
            String token = loggedInUserToken.get(email);
            return jwtProvider.validateJwtToken(token);
        }
        return false;
    }
    /**
     * registers a user with the service,
     * return true, if succeded
     * otherwise false (i.e. when assoc. email is already registered)
     * @param  user User
     * @return      boolean
     */
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
    /**
     * find a user by a given id
     * @param  id Integer
     * @return    User
     */
    @Override
    public User findUserByID(int id) {
        try {
            return userDAO.findById(id);
        } catch (DAOException e) {
            return null;
        }
    }
    /**
     * Assertion wether an email is already assoc. with a registered user
     * @param  email String
     * @return       boolean
     */
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
    /**
     * returns a User given an email
     * @param  email String
     * @return       User
     */
    @Override
    public User getUserByEmail(String email) {
        try {
            return userDAO.findByEmail(email);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * returns the associated token for an username
     * s. impl. of loggedInUserToken.getOrDefault
     * @param  username String
     * @return         String
     */
    @Override
    public String getToken(String username) {
        return this.loggedInUserToken.getOrDefault(username, null);
    }
    /**
     * set the assoc. token
     * @param username String
     * @param newToken String
     */
    @Override
    public void setToken(String username, String newToken) {
        this.loggedInUserToken.put(username, newToken);
    }
    /**
     * load Details concerning an registered User
     * @param  username String
     * @return          UserDetails
     * @throws UsernameNotFoundException [description]
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (!this.existsByEmail(s)) {
            throw new UsernameNotFoundException("Email: " + s + " not found");
        }
        return ase.Security.UserDetails.build(this.getUserByEmail(s));
    }
    /**
     * return a list of users which match the given searchterm
     * @param  searchterm String, can be assoc. with either an email or username
     * @return            List<User>
     */
    @Override
    public List<User> searchByEmailOrUsername(String searchterm){
        try {
            return userDAO.searchByEmailOrUsername(searchterm);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * updates a user
     * @param  user User
     * @return      boolean
     */
    @Override
    public boolean update(User user) {
      try {
        userDAO.update(user);
        return true;
      } catch (DAOException e) {
          e.printStackTrace();
      }
      return false;
    }
}
