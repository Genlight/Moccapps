package ase.springboot.controller;

import ase.DTO.Comment;
import ase.message.response.ResponseMessage;
import ase.service.CommentService;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CommentRESTService {
    @Autowired
    CommentService commentService;

    @GetMapping("/page/{id}/comments")
    public ResponseEntity<?> getAllCommentsForPage(@PathVariable("id") int id){
        List<Comment> comments = commentService.findCommentsForPage(id);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        try {
            String json = objectMapper.writeValueAsString(comments);
            if (comments.isEmpty()) {
                    return new ResponseEntity<>(new ResponseMessage("No Comments"), HttpStatus.OK);
            }
            return ResponseEntity.ok(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
        }
    }


}
