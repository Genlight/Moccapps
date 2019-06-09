package ase.springboot.controller;

import ase.DTO.Invitation;
import ase.DTO.Page;
import ase.message.request.Invitation.InvitationActionForm;
import ase.message.request.PageForm;
import ase.message.response.ResponseMessage;
import ase.message.socket.SocketMessage;
import ase.service.PageService;
import ase.service.UserService;
import ase.socketConnection.SocketServer;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
public class PageRESTService {

    @Autowired
    PageService pageService;

    @Autowired
    UserService userService;

    @Autowired
    SocketServer socketServer;

    @GetMapping(value = "/page/{id}")
    public ResponseEntity<?> getPage(@PathVariable("id") int id){

        Page page = pageService.getPageById(id);

        if(page!=null){
            ObjectMapper objectMapper=new ObjectMapper();
            objectMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            try {
                String json=objectMapper.writeValueAsString(page);
                return ResponseEntity.ok(json);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return new ResponseEntity<>(new ResponseMessage("error"),HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
         else{
             return new ResponseEntity<>(new ResponseMessage("Page not found"), HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping(value = "/page")
    public ResponseEntity<?> createPage(@Valid @RequestBody PageForm pageForm) {
        Page page = new Page();
        page.setPage_order(pageForm.getPage_order());
        page.setPage_data(pageForm.getPage_data());
        page.setPage_name(pageForm.getPage_name());
        page.setProject_id(pageForm.getProject_id());
        page.setHeight(pageForm.getHeight());
        page.setWidth(pageForm.getWidth());

        if(pageForm.getPage_data()==null){
            page.setPage_data("{}");
        }

        page = pageService.create(page);
        if (page!=null){

 /*           SocketMessage socketMessage = new SocketMessage();
            socketMessage.setProjectId(String.valueOf(page.getProject_id()));
            socketMessage.setPageId(String.valueOf(page.getId()));

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String token = userService.getToken(userDetails.getUsername());

            socketMessage.setUser(token);
            socketMessage.setCommand("CREATE");
            socketMessage.setContent("CONTENT");

            try {
                socketServer.onReceive(socketMessage);
            } catch (IOException e) {
                e.printStackTrace();
            }
*/

            ObjectMapper objectMapper=new ObjectMapper();
            objectMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            try {
                String json=objectMapper.writeValueAsString(page);
                return ResponseEntity.ok(json);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return new ResponseEntity<>(new ResponseMessage("error"),HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else{
            return new ResponseEntity<>(new ResponseMessage("Page could not be created."),HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(value = "/page/{id}")
    public ResponseEntity<?> updatePage(@Valid @RequestBody PageForm pageForm) {
        Page page = new Page();
        page.setId(pageForm.getId());
        page.setPage_order(pageForm.getPage_order());
        page.setPage_data(pageForm.getPage_data());
        page.setPage_name(pageForm.getPage_name());
        page.setProject_id(pageForm.getProject_id());
        page.setHeight(pageForm.getHeight());
        page.setWidth(pageForm.getWidth());


        if (pageService.update(page)){
            return new ResponseEntity<>(new ResponseMessage("Success"), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/page/{id}")
    public ResponseEntity<?> deletePage(@PathVariable("id") int id) {
        Page page = pageService.getPageById(id);

        if (pageService.delete(page)){
            return new ResponseEntity<>(new ResponseMessage("Success"), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
    }


    @GetMapping("/project/{id}/pages")
    public ResponseEntity<?> getProjectPages(@PathVariable("id") int id) {
        List<Page> pages = pageService.getAllPagesForProject(id);

        ObjectMapper objectMapper=new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        try {
            String json=objectMapper.writeValueAsString(pages);
            if(pages.isEmpty()){
                return ResponseEntity.ok(json);
                //return new ResponseEntity<>(new ResponseMessage("No Pages found."), HttpStatus.OK);
            }
            return ResponseEntity.ok(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseMessage("error"),HttpStatus.BAD_REQUEST);
        }

    }

    @GetMapping("/project/{id}/{order}")
    public ResponseEntity<?> getProjectPages(@PathVariable("id") int id,@PathVariable("order") int order) {
        Page page = pageService.getPageByProjectIdAndOrder(id,order);

        if(page!=null){
            ObjectMapper objectMapper=new ObjectMapper();
            objectMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            try {
                String json=objectMapper.writeValueAsString(page);
                return ResponseEntity.ok(json);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return new ResponseEntity<>(new ResponseMessage("error"),HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else{
            return new ResponseEntity<>(new ResponseMessage("Page not found"), HttpStatus.BAD_REQUEST);
        }

    }
}
