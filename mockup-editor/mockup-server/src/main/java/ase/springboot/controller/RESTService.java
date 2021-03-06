package ase.springboot.controller;

import ase.DTO.User;
import ase.Security.JwtProvider;
import ase.message.request.*;
import ase.message.request.User.LoginForm;
import ase.message.request.User.LogoutForm;
import ase.message.request.User.SignUpForm;
import ase.message.request.EditUserForm;
import ase.message.response.ResponseMessage;
import ase.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.File;
import java.util.*;

@RestController
public class RESTService {
    private static final Logger logger = LoggerFactory.getLogger(RESTService.class);

    @Autowired
    UserService userService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtProvider jwtProvider;

    /**
     * Registers a new user given the signUpForm json object.
     * @param signUpRequest the json object containing the user info.
     * @return HTTP statuscode 200 when successful
     *         Returns HTTP Status 400 otherwise.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignUpForm signUpRequest) {

        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return new ResponseEntity<>(new ResponseMessage("Fail -> Email is already in use!"),
                    HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setUsername(signUpRequest.getUsername());

        System.out.println("Attempt to register:" + user.toString());

        if (userService.register(user)) {
            return new ResponseEntity<>(new ResponseMessage("User registered successfully!"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResponseMessage("Something else went wrong"), HttpStatus.BAD_REQUEST);
        }


    }

    /**
     * Logs in an existing user given the submitted loginForm credentials.
     * @param loginRequest  the login data as json object
     * @return HTTP statuscode 200 when successful
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginForm loginRequest) {

        return ResponseEntity.ok(userService.login(loginRequest.getUsername(), loginRequest.getPassword()));
    }

    /**
     * Logs out an existing user given the submitted LogoutForm credentials.
     * @param logoutRequest  the logout data as json object
     * @return HTTP statuscode 200 when successful
     *         Returns HTTP Status 400 otherwise.
     */
    @PostMapping("/logout")
    public ResponseEntity<Boolean> logout(@Valid @RequestBody LogoutForm logoutRequest) {

        if (userService.logout(logoutRequest.getEmail())) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Edits the info of an existing user given the submitted EditUserForm credentials.
     * @param editUserRequest  the updated user information
     * @return HTTP statuscode 200 when successful
     *         Returns HTTP Status 400 otherwise.
     */
    @PostMapping("/user")
    public ResponseEntity<?> user(@Valid @RequestBody EditUserForm editUserRequest) {
      if (!userService.existsByEmail(editUserRequest.getEmail())) {
          return new ResponseEntity<>(new ResponseMessage("Fail -> Email not found!"),
                  HttpStatus.BAD_REQUEST);
      }
      User user = userService.getUserByEmail(editUserRequest.getEmail());

      if(!encoder.matches(editUserRequest.getPassword(), user.getPassword())) {
        return new ResponseEntity<>(new ResponseMessage("Fail -> Wrong original Password!"),
        HttpStatus.BAD_REQUEST);
      }

      if(Objects.equals(editUserRequest.getNewPassword(), null)) {
        System.out.println("No new Password sent by user: "+ editUserRequest.getEmail() + " newpassword: " + editUserRequest.getNewPassword());
      } else {
        System.out.println("setting new password '"+editUserRequest.getNewPassword() + "'for user: " + user.getEmail());
        user.setPassword(encoder.encode(editUserRequest.getNewPassword()));
      }

      user.setUsername(editUserRequest.getUsername());

      System.out.println("Attempt to update User info: " + user.toString());

      if (userService.update(user)) {
          return new ResponseEntity<>(new ResponseMessage("success"), HttpStatus.OK);
      } else {
          return new ResponseEntity<>(new ResponseMessage("Something else went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    /**
     * Tests if a valid user token is returned.
     * @return HTTP statuscode 200 when successful
     *         Returns HTTP Status 400 otherwise.
     */
    @PostMapping("/test")
    public ResponseEntity<?> test() {

        HttpHeaders headers = new HttpHeaders();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String token = userService.getToken(userDetails.getUsername());

        Date expire = jwtProvider.getExpireDateFromToken(token);
        Date now = new Date();

        long timeDiff = expire.getTime() - now.getTime();
        int diffMin = (int) timeDiff / (60 * 1000);

        if (diffMin < 5) {
            String newToken = jwtProvider.generateJwtToken(authentication);
            userService.setToken(userDetails.getUsername(), newToken);
            headers.add("Authorization", newToken);
        }

        return new ResponseEntity<String>("Success", headers, HttpStatus.OK);

    }

    /**
     * Searches for existing users given the search string.
     * @param search the search string
     * @return A list of all user objects matching the search string as json and HTTP statuscode 200 when successful
     *         Returns HTTP Status 400 otherwise.
     */
    @GetMapping("/user")
    public ResponseEntity<?> searchUser(@RequestParam String search){
        List<User> users = userService.searchByEmailOrUsername(search);

        List<UserForm> userForms = new ArrayList<>();
        for(User user: users){
            UserForm userForm = new UserForm();
            userForm.setId(user.getId());
            userForm.setEmail(user.getEmail());
            userForm.setUsername(user.getUsername());
            userForm.setPassword(user.getPassword());
            userForms.add(userForm);
        }
        ObjectMapper objectMapper=new ObjectMapper();
        try {
            String json = objectMapper.writeValueAsString(userForms);
            return new ResponseEntity<>(new ResponseMessage(json),HttpStatus.OK);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseMessage("error"),HttpStatus.BAD_REQUEST);
        }
    }

}
