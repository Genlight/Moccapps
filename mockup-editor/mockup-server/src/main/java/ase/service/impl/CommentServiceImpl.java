package ase.service.impl;

import ase.DAO.CommentDAO;
import ase.DAO.DAOException;
import ase.DTO.Comment;
import ase.DTO.CommentEntry;
import ase.service.CommentService;
import org.mapstruct.ObjectFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class);

    @Autowired
    CommentDAO commentDAO;

    /**
     * creates a comment
     * @param  comment Comment
     * @return         Comment
     */
    @Override
    public Comment createComment(Comment comment){
        try {
            return commentDAO.create(comment);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * creates a new comment
     * @param  comment      Comment
     * @return Comment
     */
    @Override
    public CommentEntry createCommentEntry(CommentEntry commentEntry){
        try {
            return commentDAO.createEntry(commentEntry);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * creates a new Comment plus a commentEntry
     * @param  comment Comment
     * @return Comment
     */
    @Override
    public Comment createCommentAndEntry(Comment comment){
        List<CommentEntry> commentEntry=comment.getCommentEntryList();
        try {
            comment = commentDAO.create(comment);
            List<CommentEntry> commentEntries=new ArrayList<>();

            for(CommentEntry e:commentEntry){
                e.setCommentId(comment.getId());
                commentEntries.add(commentDAO.createEntry(e));
            }

            comment.setCommentEntryList(commentEntries);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return comment;
    }
    /**
     * updates a Comment
     * @param  comment      Comment
     * @return Comment
     */
    @Override
    public Comment updateComment(Comment comment){
        try {
            return commentDAO.update(comment);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * updates an existing CommentEntry
     * @param  commentEntry CommentEntry
     * @return CommentEntry
     */
    @Override
    public CommentEntry updateCommentEntry(CommentEntry commentEntry){
        try {
            return commentDAO.updateEntry(commentEntry);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * delete an existing comment
     * @param  comment      Comment
     * @return boolean
     */
    @Override
    public boolean removeComment(Comment comment){
        try {
            return commentDAO.delete(comment);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return false;
    }
    /**
     * deletes an existing CommentEntry
     * @param  commentEntry CommentEntry
     * @return boolean
     */
    @Override
    public boolean removeCommentEntry(CommentEntry commentEntry){
        try {
            return commentDAO.deleteEntry(commentEntry);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return false;
    }
    /**
     * find a comment by an given ID
     * @param  id           Integer
     * @return              Comment
     */
    @Override
    public Comment findCommentById(int id){
        try {
            return commentDAO.findById(id);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * find a comment by an given UUID
     * @param  id           Integer
     * @return              Comment
     */
    @Override
    public Comment findCommentByUUID(String uuid){
        try {
            return commentDAO.findByUUID(uuid);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * finds Comments by a given pageId
     * @param  id       Integer
     * @return              List<Comment>
     */
    @Override
    public List<Comment> findCommentsForPage(int id){
        try {
            return commentDAO.findCommentsForPage(id);
        } catch (DAOException e) {
            e.printStackTrace();
        }

        return new ArrayList<>();
    }

    /**
     * find and return an List of CommentEntries, given an ID from a comment
     * @param  id           Integer
     * @return              List<CommentEntry>
     */
    @Override
    public List<CommentEntry> findCommentEntriesForComment(int id){
        try {
            return commentDAO.findEntryByCommentId(id);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }


}
