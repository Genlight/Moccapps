package ase.springboot.controller;

import ase.DTO.User;
import ase.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class RESTService {

    @Autowired
    UserService userService;

    @PostMapping("/api/v1/register")
    public ResponseEntity<Boolean> registerUser(@RequestParam("email") String email,@RequestParam("username") String username,@RequestParam("password") String password){

        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setUsername(username);

        if(userService.register(user)){
            return new ResponseEntity<>(true, HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(false, HttpStatus.OK);
        }


    }

    @PostMapping("/api/v1/login")
    public ResponseEntity<User> login(@RequestParam("email") String email, @RequestParam("password") String password) {

        User user = userService.login(email, password);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }


    }

    @PostMapping("/api/v1/logout")
    public ResponseEntity<Boolean> logout(@RequestParam("email") String email){

        if(userService.logout(email)){
            return new ResponseEntity<>(true, HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(false, HttpStatus.OK);
        }


    }

}
