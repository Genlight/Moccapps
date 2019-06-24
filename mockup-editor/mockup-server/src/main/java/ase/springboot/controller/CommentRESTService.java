package ase.springboot.controller;

import ase.DTO.Comment;
import ase.message.response.ResponseMessage;
import ase.service.CommentService;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class CommentRESTService {
    @Autowired
    CommentService commentService;

    private static final Logger logger = LoggerFactory.getLogger(CommentRESTService.class);

    /**
     * Returns all comments as json array for a page.
     * @param id    the id of the page
     * @return Json array of all comments when succesful with HTTP statuscode 200
     *         or HTTP status code 400 with error message otherwise.
     */
    @GetMapping("/page/{id}/comments")
    public ResponseEntity<?> getAllCommentsForPage(@PathVariable("id") int id){

        logger.info("getAllCommentsForPage called");
        List<Comment> comments = commentService.findCommentsForPage(id);
        for(Comment comment:comments){
            logger.info("comment:"+comment.toString());
        }
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        try {
            String json = objectMapper.writeValueAsString(comments);
           // if (comments.isEmpty()) {
           //         return new ResponseEntity<>(new ResponseMessage("No Comments"), HttpStatus.BAD_REQUEST);
            //}
            logger.info(json);
            return ResponseEntity.ok(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseMessage("unknown error at CommentRESTService"), HttpStatus.BAD_REQUEST);
        }
    }


}
