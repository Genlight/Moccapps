package ase.springboot.controller;


import ase.DTO.Project;
import ase.DTO.User;
import ase.message.request.ProjectForm;
import ase.message.response.ResponseMessage;
import ase.service.ProjectService;
import ase.service.UserService;
import ase.service.impl.ProjectServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
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

    @GetMapping("/project")
    public ResponseEntity<?> getProjects(){
        System.out.println("JHA: "+SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        ase.Security.UserDetails userDetails=(ase.Security.UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(userDetails==null){
            return new ResponseEntity<>(new ResponseMessage("not authorized"),HttpStatus.UNAUTHORIZED);
        }
        List<Project> results=projectService.findProjectByUserId(userDetails.getId());
        if(results==null){
            return ResponseEntity.notFound().build();
        }
        List<ProjectForm> projectForms=new ArrayList<>();
        for(Project project:results){
            ProjectForm projectForm=new ProjectForm();
            projectForm.setId(project.getId());
            projectForm.setProjectname(project.getProjectname());
            for(int userId:project.getUsers()){
                User user=userService.findUserByID(userId);
                if(user==null) {
                    return  ResponseEntity.notFound().build();
                }
                projectForm.addUser(user);
            }
            projectForms.add(projectForm);
        }
        ObjectMapper objectMapper=new ObjectMapper();
        try {
            String json=objectMapper.writeValueAsString(projectForms);
            return new ResponseEntity<>(new ResponseMessage(json),HttpStatus.OK);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseMessage("error"),HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/project")
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectForm projectForm){
        Project project=new Project();
        project.setProjectname(projectForm.getProjectname());
        if(projectForm.getUsers()!=null) {
            for (User user : projectForm.getUsers()) {
                project.addUser(user.getId());
            }
        }
        System.out.println(project.toString());
        if(projectService.createProject(project)){
            return new ResponseEntity<>(new ResponseMessage("success"),HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseMessage("error"),HttpStatus.BAD_REQUEST);
    }

    @PutMapping(value = "/project/{id}")
    public ResponseEntity<?> updateProject(@Valid @RequestBody ProjectForm projectForm){
        Project project=new Project();
        project.setId(projectForm.getId());
        project.setProjectname(projectForm.getProjectname());
        for(User user:projectForm.getUsers()){
            project.addUser(user.getId());
        }
        if(projectService.updateProject(project)){
            return new ResponseEntity<>(new ResponseMessage("success"),HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseMessage("error"),HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/project/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable("id") String id) {
        if (projectService.deleteProject(Integer.parseInt(id))){
            return new ResponseEntity<>(new ResponseMessage("success"), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
    }
}
