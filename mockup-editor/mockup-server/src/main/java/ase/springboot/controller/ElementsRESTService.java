package ase.springboot.controller;

import ase.DTO.User;
import ase.message.response.ResponseMessage;
import ase.service.ElementService;
import ase.service.UserService;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
//import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.Files;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * @author: Brigitte Blank
 */
@RestController
public class ElementsRESTService {

    @Autowired
    UserService userService;

    @Autowired
    ElementService elementService;

    private static final Logger logger = LoggerFactory.getLogger(ElementsRESTService.class);

    /**
     * GET for element libraries to send list of element categories and elements to client
     */
    @GetMapping("/elements")
    public ResponseEntity<?> getElements() {
        logger.error("loading elements...");
        // authenticate user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if (userDetails == null) {
            return new ResponseEntity<>(new ResponseMessage("not authorized"), HttpStatus.UNAUTHORIZED);
        }
        User user = userService.getUserByEmail(userDetails.getUsername());

        Map<String, List<String>> elements = new HashMap<>();

        // load all categories and elements
        List<String> categories = elementService.getCategories();
        for(String category : categories){
            elements.put(category,elementService.getElements(category));
        }

        // directoryname for user is base64 encoded email
        String userdirectory = Base64.getEncoder().encodeToString(user.getEmail().getBytes());
        //add user files
        elements.put("Personal",elementService.getUserElements(userdirectory));

        // send categories and elements to client
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        try {
            String json = objectMapper.writeValueAsString((elements));
            logger.info("List of categories and elements sent to client");
            return new ResponseEntity<>(new ResponseMessage(json),HttpStatus.OK);
        } catch (JsonProcessingException e) {
            logger.error("Error when loading elements");
            return new ResponseEntity<>(new ResponseMessage("Error when loading elements"),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/elements")
    public ResponseEntity<?> importImage(@RequestParam("encodedImage") String encodedImage, @RequestParam("imagename") String name) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if (userDetails == null) {
            return new ResponseEntity<>(new ResponseMessage("not authorized"), HttpStatus.UNAUTHORIZED);
        }
        User user = userService.getUserByEmail(userDetails.getUsername());

        // directoryname for user is base64 encoded email
        String userdirectory = Base64.getEncoder().encodeToString(user.getEmail().getBytes());

        // decode and save image
        byte[] imageByte = Base64.getDecoder().decode(encodedImage);
        String imgPath = "../mockup-client/src/main/web/client/src/assets/img/user/"+userdirectory+"/"+name;

        // check if directory exists
        File directory = new File("../mockup-client/src/main/web/client/src/assets/img/user/"+userdirectory);
        if (!directory.exists()) {
            directory.mkdir();
        }
        File image = new File(imgPath);
        if (image.exists()) {
            logger.error("Error when trying to import an image with a name that already exists");
            return new ResponseEntity<>(new ResponseMessage("Image with the same name already exists"),HttpStatus.CONFLICT);
        } else {
            FileOutputStream fileOutputStream = null;
            try {
                fileOutputStream = new FileOutputStream(image);
                fileOutputStream.write(imageByte);
            } catch (IOException e) {
                //e.printStackTrace();
                logger.error("Error when trying to write file to disk");
            } finally {
                if (fileOutputStream != null) {
                    try {
                        fileOutputStream.close();
                    } catch (IOException e) {
                        logger.error("Error when closing FileOutputStream");
                        //e.printStackTrace();
                    }
                }
            }
        }

        // send image url to client
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        try {
            String json = objectMapper.writeValueAsString((imgPath));
            logger.info("Image-path sent to client");
            return new ResponseEntity<>(new ResponseMessage(json),HttpStatus.OK);
        } catch (JsonProcessingException e) {
            logger.error("Error when sending image-path");
            return new ResponseEntity<>(new ResponseMessage("Error when loading elements"),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
