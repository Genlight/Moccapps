package ase.springboot.controller;

import ase.DTO.User;
import ase.Security.JwtProvider;
import ase.message.request.LoginForm;
import ase.message.request.EditUserForm;
import ase.message.request.LogoutForm;
import ase.message.request.SignUpForm;
import ase.message.response.ResponseMessage;
import ase.service.UserService;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Date;

@RestController
//@RequestMapping("/api/v1")
//@CrossOrigin(origins = "*", maxAge = 3600)
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginForm loginRequest) {

        return ResponseEntity.ok(userService.login(loginRequest.getUsername(), loginRequest.getPassword()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Boolean> logout(@Valid @RequestBody LogoutForm logoutRequest) {

        if (userService.logout(logoutRequest.getEmail())) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/user")
    public ResponseEntity<?> user(@Valid @RequestBody EditUserForm editUserRequest) {
      if (!userService.existsByEmail(editUserRequest.getEmail())) {
          return new ResponseEntity<>(new ResponseMessage("Fail -> Email not found!"),
                  HttpStatus.BAD_REQUEST);
      }
      User user = userService.getUserByEmail(editUserRequest.getEmail());

      if( editUserRequest.getPassword() != null ) {
        user.setPassword(encoder.encode(editUserRequest.getPassword()));
      }
      user.setUsername(editUserRequest.getUsername());

      System.out.println("Attempt to update User info: " + user.toString());

      if (userService.update(user)) {
          return new ResponseEntity<>(new ResponseMessage("success"), HttpStatus.OK);
      } else {
          return new ResponseEntity<>(new ResponseMessage("Something else went wrong"), HttpStatus.BAD_REQUEST);
      }
    }

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
}
