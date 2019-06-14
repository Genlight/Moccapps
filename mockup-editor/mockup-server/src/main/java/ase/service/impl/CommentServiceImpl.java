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

import java.util.ArrayList;
import java.util.List;

public class CommentServiceImpl implements CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class);

    @Autowired
    CommentDAO commentDAO;

    @Override
    public Comment createComment(Comment comment){
        try {
            return commentDAO.create(comment);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public CommentEntry createCommentEntry(CommentEntry commentEntry){
        try {
            return commentDAO.createEntry(commentEntry);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Comment createCommentAndEntry(Comment comment){
        List<CommentEntry> commentEntry=comment.getCommentEntryList();
        try {
            comment = commentDAO.create(comment);
            List<CommentEntry> commentEntries=new ArrayList<>();

            for(CommentEntry e:commentEntry){
                commentEntries.add(commentDAO.createEntry(e));
            }

            comment.setCommentEntryList(commentEntries);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return comment;
    }

    @Override
    public Comment upadteComment(Comment comment){
        try {
            return commentDAO.update(comment);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public CommentEntry updateCommentEntry(CommentEntry commentEntry){
        try {
            return commentDAO.updateEntry(commentEntry);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public boolean removeComment(Comment comment){
        try {
            return commentDAO.delete(comment);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean deleteCommentEntry(CommentEntry commentEntry){
        try {
            return commentDAO.deleteEntry(commentEntry);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public Comment findCommentById(int id){
        try {
            return commentDAO.findById(id);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<Comment> findCommentsForPage(int id){
        try {
            return commentDAO.findCommentsForPage(id);
        } catch (DAOException e) {
            e.printStackTrace();
        }

        return new ArrayList<>();
    }

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
