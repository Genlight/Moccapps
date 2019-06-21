package ase.DAO.impl;

import ase.DAO.AbstractDAO;
import ase.DAO.CommentDAO;
import ase.DAO.DAOException;
import ase.DAO.UserDAO;
import ase.DTO.Comment;
import ase.DTO.CommentEntry;
import ase.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;

@Repository
public class CommentDAOImpl extends AbstractDAO implements CommentDAO {

    @Autowired
    UserDAO userDAO;

    private static final Logger logger  = LoggerFactory.getLogger(CommentDAOImpl.class);
    private static final Calendar currentDt = new GregorianCalendar(TimeZone.getTimeZone("GMT+2"));

    private static final String PSTMT_CREATE = "INSERT INTO comments (page_id,cleared,uuid) VALUES (?,?,?)";
    private static final String PSTMT_CREATEENTRY = "INSERT INTO comment_entries (message,entry_order,user_id,comment_id,date) VALUES (?,?,?,?,?)";
    private static final String PSTMT_CREATEOBJECT = "INSERT INTO comment_objects (comment_id,object_id) VALUES (?,?)";


    private static final String PSTMT_UPDATE = "UPDATE comments SET page_id=?,cleared=? WHERE id=?";
    private static final String PSTMT_UPDATEENTRY = "UPDATE comment_entries SET message=?, user_id=?, comment_id=?,date=?,entry_order = ? WHERE id=?";
    private static final String PSTMT_UPDATEOBJECT = "UPDATE comment_objects SET comment_id=?, object_id=? WHERE id=?";

    private static final String PSTMT_DELETE = "DELETE FROM comments WHERE id=?";
    private static final String PSTMT_DELETEENTRY = "DELETE FROM comment_entries WHERE id=?";
    private static final String PSTMT_DELETEOBJECT = "DELETE FROM comment_objects WHERE id=?";

    private static final String PSTMT_FINDCOMMENTBYID = "SELECT * FROM comments WHERE id=?";
    private static final String PSTMT_FINDCOMMENTENTRYBYID = "SELECT * FROM comment_entries WHERE id=?";
    private static final String PSTMT_FINDCOMMENTOBJECTBYID = "SELECT * FROM comment_objects WHERE id=?";

    private static final String PSTMT_FINDCOMMENTENTRYBYCOMMENTID = "SELECT * FROM comment_entries WHERE comment_id=?";
    private static final String PSTMT_FINDCOMMENTOBJECTBYCOMMENTID = "SELECT * FROM comment_objects WHERE comment_id=?";


    private static final String PSTMT_FINDBYPAGEID = "SELECT * FROM comments WHERE page_id=?";
    private static final String PSTMT_FINDBYOBJECTID = "SELECT * FROM comment_objects WHERE object_id=?";
    private PreparedStatement pstmt;

    @Override
    public Comment create(Comment comment) throws DAOException {
        if(comment==null){
            logger.error("Error during Creation of comment: comment is empty");
            throw new DAOException("Error during Creation of comment: comment is empty");
        }

        try{
            getConnection();
            logger.info("comment:"+comment.toString());
            pstmt=connection.prepareStatement(PSTMT_CREATE, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, comment.getPage_id());
            pstmt.setBoolean(2,comment.isCleared());
            pstmt.setString(3,comment.getUuid());
            pstmt.executeUpdate();

            ResultSet rs=pstmt.getGeneratedKeys();
            rs.next();
            comment.setId(rs.getInt(1));
            rs.close();
            pstmt.close();

            for(String s:comment.getCommentObjects()){
                pstmt=connection.prepareStatement(PSTMT_CREATEOBJECT);
                pstmt.setInt(1, comment.getId());
                pstmt.setString(2,s);
                pstmt.executeUpdate();
                pstmt.close();
            }

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Creation of comment: Couldn't connect to database");
            throw new DAOException("Error during Creation of comment: Couldn't connect to database");
        }
        return comment;
    }

    @Override
    public CommentEntry createEntry(CommentEntry commentEntry) throws DAOException {
        if(commentEntry==null){
            logger.error("Error during Creation of comment: comment is empty");
            throw new DAOException("Error during Creation of comment: comment is empty");
        }

        try{
            logger.info("createEntry:"+commentEntry.toString());
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_CREATEENTRY, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1,commentEntry.getMessage());
            pstmt.setInt(2,commentEntry.getOrder());
            pstmt.setInt(3, commentEntry.getUser().getId());
            pstmt.setInt(4, commentEntry.getCommentId());
            pstmt.setTimestamp(5,commentEntry.getDate(),currentDt);
            pstmt.executeUpdate();

            ResultSet rs=pstmt.getGeneratedKeys();
            rs.next();
            commentEntry.setId(rs.getInt(1));
            rs.close();


            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Creation of comment: Couldn't connect to database");
            throw new DAOException("Error during Creation of comment: Couldn't connect to database");
        }
        return commentEntry;
    }

    @Override
    public Comment update(Comment comment) throws DAOException {
        if(comment==null){
            logger.error("Error during Update of comment: comment is empty");
            throw new DAOException("Error during Update of comment: comment is empty");
        }

        try{
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_UPDATE);
            pstmt.setInt(1, comment.getPage_id());
            pstmt.setBoolean(2,comment.isCleared());
            pstmt.setInt(3,comment.getId());
            pstmt.executeUpdate();
            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Update of comment: Couldn't connect to database");
            throw new DAOException("Error during Update of comment: Couldn't connect to database");
        }
        return comment;
    }

    @Override
    public CommentEntry updateEntry(CommentEntry commentEntry) throws DAOException {
        if(commentEntry==null){
            logger.error("Error during Update of comment: comment is empty");
            throw new DAOException("Error during Update of comment: comment is empty");
        }

        try{
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_UPDATEENTRY);
            pstmt.setString(1,commentEntry.getMessage());
            pstmt.setInt(2, commentEntry.getUser().getId());
            pstmt.setInt(3, commentEntry.getCommentId());
            pstmt.setTimestamp(4,commentEntry.getDate());
            pstmt.setInt(5,commentEntry.getId());
            pstmt.setInt(6,commentEntry.getOrder());
            pstmt.executeUpdate();
            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Update of comment: Couldn't connect to database");
            throw new DAOException("Error during Update of comment: Couldn't connect to database");
        }
        return commentEntry;
    }

    @Override
    public boolean delete(Comment comment) throws DAOException {
        int success;
        if(comment==null || comment.getId()<0){
            logger.error("Error during Delete of comment: comment is empty or id invalid");
            throw new DAOException("Error during Delete of comment: comment is empty or id invalid");
        }

        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_DELETE);
            pstmt.setInt(1,comment.getId());
            success=pstmt.executeUpdate();
            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Update of comment: Couldn't connect to database");
            throw new DAOException("Error during Update of comment: Couldn't connect to database");
        }
        return (success>0);
    }

    @Override
    public boolean deleteEntry(CommentEntry commentEntry) throws DAOException {
        int success;
        if(commentEntry==null || commentEntry.getId()<0){
            logger.error("Error during Delete of comment: comment is empty or id invalid");
            throw new DAOException("Error during Delete of comment: comment is empty or id invalid");
        }

        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_DELETEENTRY);
            pstmt.setInt(1,commentEntry.getId());
            success=pstmt.executeUpdate();
            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Update of comment: Couldn't connect to database");
            throw new DAOException("Error during Update of comment: Couldn't connect to database");
        }
        return (success>0);
    }

    @Override
    public Comment findById(int id) throws DAOException {
        if(id<0){
            logger.error("Error during Find by ID of comment: Invalid ID");
            throw new DAOException("Error during Find by ID of comment: Invalid ID");
        }
        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDCOMMENTBYID);
            pstmt.setInt(1,id);
            ResultSet rs=pstmt.executeQuery();
            Comment comment = null;
            if (rs.next()) {
                comment = new Comment(
                        rs.getInt("id"),
                        rs.getInt("page_id"),
                        rs.getString("uuid"),
                        rs.getBoolean("cleared"));
            }
            rs.close();
            pstmt.close();

            pstmt=connection.prepareStatement(PSTMT_FINDCOMMENTOBJECTBYCOMMENTID);
            pstmt.setInt(1,id);
            rs=pstmt.executeQuery();
            List<String> objectList = new ArrayList<>();
            while (rs.next()) {
                objectList.add(rs.getString("object_id"));
            }
            comment.setCommentObjects(objectList);
            rs.close();
            pstmt.close();

            comment.setCommentEntryList(this.findEntryByCommentId(id));

            return comment;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by ID of comment: Couldn't connect to database");
            throw new DAOException("Error during Find by ID of comment: Couldn't connect to database");
        }
    }

    @Override
    public List<CommentEntry> findEntryByCommentId(int id) throws DAOException {
        if(id<0){
            logger.error("Error during Find by ID of comment: Invalid ID");
            throw new DAOException("Error during Find by ID of comment: Invalid ID");
        }
        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDCOMMENTENTRYBYCOMMENTID);
            pstmt.setInt(1,id);
            ResultSet rs=pstmt.executeQuery();
            List<CommentEntry> commentEntryList = new ArrayList<>();
            while (rs.next()) {
                commentEntryList.add(new CommentEntry(rs.getInt("id"),
                        rs.getString("message"),
                        userDAO.findById(rs.getInt("user_id")),
                        rs.getTimestamp("date"),
                        rs.getInt("comment_id"),
                        rs.getInt("entry_order")));
            }
            rs.close();
            pstmt.close();

            return commentEntryList;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by ID of comment: Couldn't connect to database");
            throw new DAOException("Error during Find by ID of comment: Couldn't connect to database");
        }
    }

    @Override
    public List<Comment> findCommentsForPage(int pageId) throws DAOException {
        try{
            List<Integer> commentIds=new ArrayList<>();
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDBYPAGEID);
            pstmt.setInt(1, pageId);
            ResultSet rs=pstmt.executeQuery();

            while(rs.next()){
                commentIds.add(rs.getInt("id"));
            }
            rs.close();
            pstmt.close();

            List<Comment> comments = new ArrayList<>();
            for(int i:commentIds){
                comments.add(this.findById(i));
            }

            return comments;

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find multiple Comments: Couldn't connect to database");
            throw new DAOException("Error during Find multiple Comments: Couldn't connect to database");
        }
    }

    /*@Override
    public List<Comment> findCommentforObject(String objectId) throws DAOException {
        try{
            List<Comment> comments=new ArrayList<>();
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDBYOBJECTID);
            pstmt.setString(1, objectId);
            ResultSet rs=pstmt.executeQuery();

            while(rs.next()){
                comments.add(new Comment(
                        rs.getInt("id"),
                        rs.getString("message"),
                        rs.getInt("user_id"),
                        rs.getInt("page_id"),
                        rs.getDate("date"),
                        rs.getBoolean("cleared"),
                        rs.getString("object_id")));
            }
            rs.close();
            pstmt.close();
            return comments;

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find multiple Comments: Couldn't connect to database");
            throw new DAOException("Error during Find multiple Comments: Couldn't connect to database");
        }
    }*/
}
