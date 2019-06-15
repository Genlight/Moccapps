package ase.springboot.controller;

import ase.DTO.Invitation;
import ase.DTO.Project;
import ase.DTO.User;
import ase.message.request.Invitation.InvitationActionForm;
import ase.message.response.Invitation.UserInvitationResponse;
import ase.message.response.ResponseMessage;
import ase.service.ElementService;
import ase.service.InvitationService;
import ase.service.ProjectService;
import ase.service.UserService;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.File;
import java.util.ArrayList;
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
    @GetMapping("/editor/elements")
    public ResponseEntity<?> getAllAvailableElements() {
        logger.error("loading elements...");
        // authenticate user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByEmail(userDetails.getUsername());

        Map<String,List<String>> elements = new HashMap<>();

        // load all categories and elements
        List<String> categories = elementService.getCategories();
        for(String category : categories){
            logger.error("loading elements for "+category);
            elements.put(category,elementService.getElements(category));
        }

        // send categories and elements
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        try {
            String json = objectMapper.writeValueAsString((elements));
            logger.info("List of categories and elements sent to client");
            return new ResponseEntity<>(new ResponseMessage(json),HttpStatus.OK);
        } catch (JsonProcessingException e) {
            logger.error("Error when loading elements");
            return new ResponseEntity<>(new ResponseMessage("Error when loading elements"),HttpStatus.BAD_REQUEST);
        }
    }
}
