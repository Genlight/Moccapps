package ase.springboot.controller;

import ase.DTO.Invitation;
import ase.DTO.Project;
import ase.DTO.User;
import ase.message.request.Invitation.InvitationActionForm;
import ase.message.response.Invitation.UserInvitationResponse;
import ase.message.response.ResponseMessage;
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
import java.util.ArrayList;
import java.util.List;

@RestController
public class InvitationRESTService {

    @Autowired
    InvitationService invitationService;

    @Autowired
    UserService userService;

    @Autowired
    ProjectService projectService;

    private static final Logger logger = LoggerFactory.getLogger(InvitationRESTService.class);


    //GET		/project/invite
    @GetMapping("/project/invite")
    public ResponseEntity<?> getAllInvitesForUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByEmail(userDetails.getUsername());

        List<UserInvitationResponse> invitationResponses = new ArrayList<>();

        List<Invitation> invitationList = invitationService.getAllInvitationsForInvitedUser(user);
        for(Invitation invitation:invitationList){
            Project project = projectService.getProjectById(invitation.getProject_id());
            UserInvitationResponse userInvitationResponse
                    = new UserInvitationResponse(invitation.getId(),project,userService.findUserByID(invitation.getInviter_user_id()));
            invitationResponses.add(userInvitationResponse);
        }

        ObjectMapper objectMapper=new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        try {
            String json=objectMapper.writeValueAsString(invitationResponses);
            if(invitationResponses.isEmpty()){
                return new ResponseEntity<>(new ResponseMessage("No Invitations"), HttpStatus.OK);
            }
            return ResponseEntity.ok(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseMessage("error"),HttpStatus.BAD_REQUEST);
        }

    }

/*    //POST		/project/invite
    @PostMapping("/project/invite")
    public ResponseEntity<?> createInvitation(@Valid @RequestBody InvitationForm invitationForm) {
        logger.error("CREATE:" + invitationForm);
        if (invitationService.create(invitationForm)) {
            return new ResponseEntity<>(new ResponseMessage("Success"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResponseMessage("Error"), HttpStatus.BAD_REQUEST);
        }
    }*/


    //PUT		/project/invite/{id}
    @PutMapping(value = "/project/invite/{id}")
    public ResponseEntity<?> updateInvitation(@Valid @RequestBody InvitationActionForm invitationForm) {
        Invitation invitation = invitationService.getInvitationById(invitationForm.getId());
        String action = invitationForm.getAction();

        if(action.equals("decline")){
            invitationService.declineInvitation(invitation);
            return new ResponseEntity<>(new ResponseMessage("Success"), HttpStatus.OK);
        }
        else if(action.equals("accept")){
            invitationService.acceptInvitation(invitation);
            return new ResponseEntity<>(new ResponseMessage("Success"), HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(new ResponseMessage("error"),HttpStatus.BAD_REQUEST);
        }

    }
    //DELETE	/project/invite/{id}
    @DeleteMapping("/project/invite/{id}")
    public ResponseEntity<?> deleteInvitation(@PathVariable("id") int id) {
        Invitation invitation = invitationService.getInvitationById(id);
        logger.error("DELETE:" + invitation.toString());

        if (invitationService.delete(invitation)){
            return new ResponseEntity<>(new ResponseMessage("success"), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
    }


}
