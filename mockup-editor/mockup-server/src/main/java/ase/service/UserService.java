package ase.service;

import ase.DTO.User;
import ase.message.response.JwtResponse;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    /**
     *  set the passed user to logged in if the password is correct
     *
     * @param email email of the user to be loggedin
     * @param password password of the user with the given email
     * @returns User returns User if the login was successful, null otherwise
     */
    JwtResponse login(String email, String password);

    /**
     *  remove the user from the list of logged in users
     *
     * @param email email of the user to be logged out
     * @returns boolean returns true if the logout was successful, false if the user wasn't logged in
     */
    boolean logout(String email);

    /**
     *  returns if the user is logged
     *
     * @param email email of the user
     * @returns boolean returns true if the user is logged in, false otherwise
     */
    boolean isLoggedIn(String email);

    /**
     *  creates a new user
     *
     * @param user data of the user to be created (id shouldn't be set, as it is generated by the database)
     * @returns boolean returns true if the registration was succesful, false otherwise
     */
    boolean register(User user);

    /**
     *  finds a user by the given id
     *
     * @param id of the user to be found
     * @return user with the given id
     */
    User findUserByID(int id);

    boolean existsByEmail(String email);

    User getUserByEmail(String email);

    String getToken(String username);

    void setToken(String username, String newToken);

    boolean update(User user);
}
