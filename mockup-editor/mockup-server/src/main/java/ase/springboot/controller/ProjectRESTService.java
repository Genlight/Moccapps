package ase.springboot.controller;


import ase.DAO.impl.PageVersionDAOImpl;
import ase.DTO.*;
import ase.Security.UserDetails;
import ase.message.request.Invitation.InvitationForm;
import ase.message.request.ProjectForm;
import ase.message.response.ProjectFormResponse;
import ase.message.response.ResponseMessage;
import ase.service.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Matthias Deimel
 */
@RestController
public class ProjectRESTService {

    @Autowired
    ProjectService projectService;
    @Autowired
    UserService userService;

    @Autowired
    PageVersionService pageVersionService;

    @Autowired
    ProjectVersionService projectVersionService;

    private static final Logger logger = LoggerFactory.getLogger(ProjectRESTService.class);
    @Autowired
    InvitationService invitationService;

    @GetMapping("/project")
    public ResponseEntity<?> getProjects() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User tempUser = userService.getUserByEmail(userDetails.getUsername());

        if (userDetails == null) {
            return new ResponseEntity<>(new ResponseMessage("not authorized"), HttpStatus.UNAUTHORIZED);
        }

        List<Project> results = projectService.findProjectByUserId(tempUser.getId());
        if (results == null) {
            return ResponseEntity.notFound().build();
        }
        List<ProjectFormResponse> projectFormResponses = new ArrayList<>();
        for (Project project : results) {
            ProjectFormResponse projectForm = new ProjectFormResponse();
            projectForm.setId(project.getId());
            projectForm.setProjectname(project.getProjectname());
            projectForm.setLastModified(project.getLastModified());
            for (int userId : project.getUsers()) {
                User user = userService.findUserByID(userId);
                if (user == null) {
                    return ResponseEntity.notFound().build();
                } else {
                    projectForm.addUser(user);
                }
            }
            List<Invitation> invitations = invitationService.getAllInvitationsForProject(project);

            List<InvitationU> invitationUS = new ArrayList<>();

            for (Invitation e : invitations) {
                InvitationU b = new InvitationU();
                b.setId(e.getId());
                b.setProject_id(e.getProject_id());
                b.setInvitee(userService.findUserByID(e.getInvitee_user_id()));
                b.setInviter(userService.findUserByID(e.getInviter_user_id()));
                invitationUS.add(b);

            }

            projectForm.setInvitations(invitationUS);

            projectFormResponses.add(projectForm);
        }
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String json = objectMapper.writeValueAsString(projectFormResponses);
            return ResponseEntity.ok(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/project")
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectForm projectForm){
        ase.Security.UserDetails userDetails=(ase.Security.UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(userDetails==null){
            return new ResponseEntity<>(new ResponseMessage("not authorized"),HttpStatus.UNAUTHORIZED);
        }

        Project project=new Project();
        project.setProjectname(projectForm.getProjectname());

        boolean containsCreator = false;

        if(projectForm.getUsers()!=null) {
            for (User user : projectForm.getUsers()) {
                if (user.getEmail() == userDetails.getUsername()){
                    containsCreator = true;
                }
                project.addUser(user.getId());
            }
        }

        //Add the initial creator to users field of the project, if he/she was not already in the users field.
        if (!containsCreator) {
            int userId = userService.getUserByEmail(userDetails.getUsername()).getId();
            project.addUser(userId);
        }

        Project result;

        try {
            result = this.projectService.createProject(project);
        } catch (Exception e){
            return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
        }

        ObjectMapper mapper = new ObjectMapper();

        try {
            String json = mapper.writeValueAsString(result);
            return ResponseEntity.ok(json);
        } catch (JsonProcessingException e) {
            return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(value = "/project/{id}")
    public ResponseEntity<?> updateProject(@Valid @RequestBody ProjectForm projectForm) {
        Project project = new Project();
        project.setId(projectForm.getId());
        project.setProjectname(projectForm.getProjectname());
        for (User user : projectForm.getUsers()) {
            project.addUser(user.getId());
        }

        projectService.updateProject(project);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        InvitationForm invitationForm = new InvitationForm();
        invitationForm.setProjectID(project.getId());
        invitationForm.setInviteeEmailList(projectForm.getInvitations());
        logger.error("Project-Invite:" + invitationForm.toString());
        if (invitationService.update(invitationForm, userDetails.getUsername())) {
            return new ResponseEntity<>(new ResponseMessage("success"), HttpStatus.OK);
        }

        return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/project/{id}/versions")
    public ResponseEntity<?> getProjectVersions(@PathVariable("id") int id) {

        List<ProjectVersion> temp = projectVersionService.getProjectVersionByProjectId(id);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String json = objectMapper.writeValueAsString(temp);
            return ResponseEntity.ok(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/project/{id}/versions")
    public ResponseEntity<?> restoreProject(@PathVariable("id") int id,@RequestBody ProjectVersion projectVersion){
       logger.info("Entered restoreProject");

        ase.Security.UserDetails userDetails=(ase.Security.UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Project project=new Project();
        project.setProjectname(projectVersion.getVersionName());

        int userId = userService.getUserByEmail(userDetails.getUsername()).getId();
        project.addUser(userId);

        try {
            project = this.projectService.createProject(project);
        } catch (Exception e){
            return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
        }

        List<PageVersion> pages = pageVersionService.getAllPagesForProject(projectVersion.getId());
        logger.info("restore pages:"+pages.toString());
        List<Page> pageList = pageVersionService.restorePages(pages,project.getId());
        logger.info("restore pageversions:"+pageList.toString());
        project.setPages(pageList);

        ObjectMapper mapper = new ObjectMapper();
        try {
            String json = mapper.writeValueAsString(project);
            return ResponseEntity.ok(json);
        } catch (JsonProcessingException e) {
            return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/project/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable("id") String id) {
        if (projectService.deleteProject(Integer.parseInt(id))) {
            return new ResponseEntity<>(new ResponseMessage("success"), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
    }
}
