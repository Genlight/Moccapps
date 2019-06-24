package ase.DAO.impl;

import ase.DAO.AbstractDAO;
import ase.DAO.CommentDAO;
import ase.DAO.DAOException;
import ase.DAO.UserDAO;
import ase.DTO.Comment;
import ase.DTO.CommentEntry;
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

    private static final Logger logger = LoggerFactory.getLogger(CommentDAOImpl.class);
    private static final Calendar currentDt = new GregorianCalendar(TimeZone.getTimeZone("GMT+2"));

    private static final String PSTMT_CREATE = "INSERT INTO comments (page_id,cleared,uuid) VALUES (?,?,?)";
    private static final String PSTMT_CREATEENTRY = "INSERT INTO comment_entries (message,uuid,user_id,comment_id,date) VALUES (?,?,?,?,?)";
    private static final String PSTMT_CREATEOBJECT = "INSERT INTO comment_objects (comment_id,object_id) VALUES (?,?)";


    private static final String PSTMT_UPDATE = "UPDATE comments SET page_id=?,cleared=?,uuid=? WHERE id=?";
    private static final String PSTMT_UPDATEENTRY = "UPDATE comment_entries SET message=?, user_id=?, comment_id=?,date=?,uuid = ? WHERE id=?";
    private static final String PSTMT_UPDATEOBJECT = "UPDATE comment_objects SET comment_id=?, object_id=? WHERE id=?";

    private static final String PSTMT_DELETE = "DELETE FROM comments WHERE id=?";
    private static final String PSTMT_DELETEENTRY = "DELETE FROM comment_entries WHERE id=?";
    private static final String PSTMT_DELETEOBJECT = "DELETE FROM comment_objects WHERE id=?";

    private static final String PSTMT_FINDCOMMENTBYID = "SELECT * FROM comments WHERE id=?";
    private static final String PSTMT_FINDCOMMENTBYUUID = "SELECT * FROM comments WHERE uuid=?";
    private static final String PSTMT_FINDCOMMENTENTRYBYID = "SELECT * FROM comment_entries WHERE id=?";
    private static final String PSTMT_FINDCOMMENTOBJECTBYID = "SELECT * FROM comment_objects WHERE id=?";

    private static final String PSTMT_FINDCOMMENTENTRYBYCOMMENTID = "SELECT * FROM comment_entries WHERE comment_id=?";
    private static final String PSTMT_FINDCOMMENTOBJECTBYCOMMENTID = "SELECT * FROM comment_objects WHERE comment_id=?";


    private static final String PSTMT_FINDBYPAGEID = "SELECT * FROM comments WHERE page_id=?";
    private static final String PSTMT_FINDBYOBJECTID = "SELECT * FROM comment_objects WHERE object_id=?";
    private PreparedStatement pstmt;

    /**
     * creates a new comment
     * @param  comment      Comment
     * @return Comment
     * @throws DAOException
     */
    @Override
    public Comment create(Comment comment) throws DAOException {
        if (comment == null) {
            logger.error("Error during Creation of comment: comment is empty");
            throw new DAOException("Error during Creation of comment: comment is empty");
        }

        try {
            getConnection();
            logger.info("comment:" + comment.toString());
            pstmt = connection.prepareStatement(PSTMT_CREATE, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, comment.getPage_id());
            pstmt.setBoolean(2, comment.isCleared());
            pstmt.setString(3, comment.getUuid());
            pstmt.executeUpdate();

            ResultSet rs = pstmt.getGeneratedKeys();
            rs.next();
            comment.setId(rs.getInt(1));
            rs.close();
            pstmt.close();

            for (String s : comment.getCommentObjects()) {
                pstmt = connection.prepareStatement(PSTMT_CREATEOBJECT);
                pstmt.setInt(1, comment.getId());
                pstmt.setString(2, s);
                pstmt.executeUpdate();
                pstmt.close();
            }

        } catch (SQLException e) {
            logger.error(e.getMessage());
            logger.error("Error during Creation of comment: Couldn't connect to database");
            throw new DAOException("Error during Creation of comment: Couldn't connect to database");
        }
        return comment;
    }

    /**
     * creates a new CommentEntry for a existing comment
     * @param  commentEntry CommentEntry
     * @return CommentEntry
     * @throws DAOException
     */
    @Override
    public CommentEntry createEntry(CommentEntry commentEntry) throws DAOException {
        if (commentEntry == null) {
            logger.error("Error during Creation of comment: comment is empty");
            throw new DAOException("Error during Creation of comment: comment is empty");
        }

        try {
            logger.info("createEntry:" + commentEntry.toString());
            getConnection();
            pstmt = connection.prepareStatement(PSTMT_CREATEENTRY, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, commentEntry.getMessage());
            pstmt.setString(2, commentEntry.getUuid());
            pstmt.setInt(3, commentEntry.getUser().getId());
            pstmt.setInt(4, commentEntry.getCommentId());
            pstmt.setTimestamp(5, commentEntry.getDate(), currentDt);
            pstmt.executeUpdate();

            ResultSet rs = pstmt.getGeneratedKeys();
            rs.next();
            commentEntry.setId(rs.getInt(1));
            rs.close();


            pstmt.close();

        } catch (SQLException e) {
            logger.error(e.getMessage());
            logger.error("Error during Creation of comment: Couldn't connect to database");
            throw new DAOException("Error during Creation of comment: Couldn't connect to database");
        }
        return commentEntry;
    }
    /**
     * updates a Comment
     * @param  comment      Comment
     * @return Comment
     * @throws DAOException [description]
     */
    @Override
    public Comment update(Comment comment) throws DAOException {
        if (comment == null) {
            logger.error("Error during Update of comment: comment is empty");
            throw new DAOException("Error during Update of comment: comment is empty");
        }

        try {
            getConnection();
            pstmt = connection.prepareStatement(PSTMT_UPDATE);
            pstmt.setInt(1, comment.getPage_id());
            pstmt.setBoolean(2, comment.isCleared());
            pstmt.setString(3,comment.getUuid());
            pstmt.setInt(4, comment.getId());
            pstmt.executeUpdate();
            pstmt.close();

        } catch (SQLException e) {
            logger.error(e.getMessage());
            logger.error("Error during Update of comment: Couldn't connect to database");
            throw new DAOException("Error during Update of comment: Couldn't connect to database");
        }
        return comment;
    }
    /**
     * updates an existing CommentEntry
     * @param  commentEntry CommentEntry
     * @return CommentEntry
     * @throws DAOException [description]
     */
    @Override
    public CommentEntry updateEntry(CommentEntry commentEntry) throws DAOException {
        if (commentEntry == null) {
            logger.error("Error during Update of comment: comment is empty");
            throw new DAOException("Error during Update of comment: comment is empty");
        }

        try {
            getConnection();
            pstmt = connection.prepareStatement(PSTMT_UPDATEENTRY);
            pstmt.setString(1, commentEntry.getMessage());
            pstmt.setInt(2, commentEntry.getUser().getId());
            pstmt.setInt(3, commentEntry.getCommentId());
            pstmt.setTimestamp(4, commentEntry.getDate());
            pstmt.setInt(5, commentEntry.getId());
            pstmt.setString(6, commentEntry.getUuid());
            pstmt.executeUpdate();
            pstmt.close();

        } catch (SQLException e) {
            logger.error(e.getMessage());
            logger.error("Error during Update of comment: Couldn't connect to database");
            throw new DAOException("Error during Update of comment: Couldn't connect to database");
        }
        return commentEntry;
    }

    /**
     * delete an existing comment
     * @param  comment      Comment
     * @return boolean
     * @throws DAOException [description]
     */
    @Override
    public boolean delete(Comment comment) throws DAOException {
        int success;
        if (comment == null || comment.getId() < 0) {
            logger.error("Error during Delete of comment: comment is empty or id invalid");
            throw new DAOException("Error during Delete of comment: comment is empty or id invalid");
        }

        try {
            getConnection();
            pstmt = connection.prepareStatement(PSTMT_DELETE);
            pstmt.setInt(1, comment.getId());
            success = pstmt.executeUpdate();
            pstmt.close();

        } catch (SQLException e) {
            logger.error(e.getMessage());
            logger.error("Error during Update of comment: Couldn't connect to database");
            throw new DAOException("Error during Update of comment: Couldn't connect to database");
        }
        return (success > 0);
    }

    /**
     * deletes an existing CommentEntry
     * @param  commentEntry CommentEntry
     * @return boolean
     * @throws DAOException [description]
     */
    @Override
    public boolean deleteEntry(CommentEntry commentEntry) throws DAOException {
        int success;
        if (commentEntry == null || commentEntry.getId() < 0) {
            logger.error("Error during Delete of comment: comment is empty or id invalid");
            throw new DAOException("Error during Delete of comment: comment is empty or id invalid");
        }

        try {
            getConnection();
            pstmt = connection.prepareStatement(PSTMT_DELETEENTRY);
            pstmt.setInt(1, commentEntry.getId());
            success = pstmt.executeUpdate();
            pstmt.close();

        } catch (SQLException e) {
            logger.error(e.getMessage());
            logger.error("Error during Update of comment: Couldn't connect to database");
            throw new DAOException("Error during Update of comment: Couldn't connect to database");
        }
        return (success > 0);
    }

    /**
     * find a comment by an given ID
     * @param  id           Integer
     * @return              Comment
     * @throws DAOException [description]
     */
    @Override
    public Comment findById(int id) throws DAOException {
        if (id < 0) {
            logger.error("Error during Find by ID of comment: Invalid ID");
            throw new DAOException("Error during Find by ID of comment: Invalid ID");
        }
        try {
            getConnection();
            pstmt = connection.prepareStatement(PSTMT_FINDCOMMENTBYID);
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
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

            pstmt = connection.prepareStatement(PSTMT_FINDCOMMENTOBJECTBYCOMMENTID);
            pstmt.setInt(1, id);
            rs = pstmt.executeQuery();
            List<String> objectList = new ArrayList<>();
            while (rs.next()) {
                objectList.add(rs.getString("object_id"));
            }
            comment.setCommentObjects(objectList);
            rs.close();
            pstmt.close();

            comment.setCommentEntryList(this.findEntryByCommentId(id));

            return comment;
        } catch (SQLException e) {
            logger.error(e.getMessage());
            logger.error("Error during Find by ID of comment: Couldn't connect to database");
            throw new DAOException("Error during Find by ID of comment: Couldn't connect to database");
        }
    }

    /**
     * find and return an List of CommentEntries, given an ID from a comment
     * @param  id           Integer
     * @return              List<CommentEntry>
     * @throws DAOException [description]
     */
    @Override
    public List<CommentEntry> findEntryByCommentId(int id) throws DAOException {
        if (id < 0) {
            logger.error("Error during Find by ID of comment: Invalid ID");
            throw new DAOException("Error during Find by ID of comment: Invalid ID");
        }
        try {
            getConnection();
            pstmt = connection.prepareStatement(PSTMT_FINDCOMMENTENTRYBYCOMMENTID);
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            List<CommentEntry> commentEntryList = new ArrayList<>();
            while (rs.next()) {
                commentEntryList.add(new CommentEntry(rs.getInt("id"),
                        rs.getString("message"),
                        userDAO.findById(rs.getInt("user_id")),
                        rs.getTimestamp("date"),
                        rs.getInt("comment_id"),
                        rs.getString("uuid")));
            }
            rs.close();
            pstmt.close();

            return commentEntryList;
        } catch (SQLException e) {
            logger.error(e.getMessage());
            logger.error("Error during Find by ID of comment: Couldn't connect to database");
            throw new DAOException("Error during Find by ID of comment: Couldn't connect to database");
        }
    }

    /**
     * finds Comments by a given pageId
     * @param  pageId       Integer
     * @return              List<Comment>
     * @throws DAOException [description]
     */
    @Override
    public List<Comment> findCommentsForPage(int pageId) throws DAOException {
        try {
            List<Integer> commentIds = new ArrayList<>();
            getConnection();
            pstmt = connection.prepareStatement(PSTMT_FINDBYPAGEID);
            pstmt.setInt(1, pageId);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                commentIds.add(rs.getInt("id"));
            }
            rs.close();
            pstmt.close();

            List<Comment> comments = new ArrayList<>();
            for (int i : commentIds) {
                comments.add(this.findById(i));
            }

            return comments;

        } catch (SQLException e) {
            logger.error(e.getMessage());
            logger.error("Error during Find multiple Comments: Couldn't connect to database");
            throw new DAOException("Error during Find multiple Comments: Couldn't connect to database");
        }
    }

    /**
     * finds a comment by a given UUID
     * @param  uuid         String
     * @return              Comment
     * @throws DAOException [description]
     */
    @Override
    public Comment findByUUID(String uuid) throws DAOException {
        if (uuid == null || uuid.isEmpty()) {
            logger.error("Error during Find by uuid of comment: Invalid uuid");
            throw new DAOException("Error during Find by uuid of comment: Invalid uuid");
        }
        try {
            getConnection();
            pstmt = connection.prepareStatement(PSTMT_FINDCOMMENTBYUUID);
            pstmt.setString(1, uuid);
            ResultSet rs = pstmt.executeQuery();
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

            pstmt = connection.prepareStatement(PSTMT_FINDCOMMENTOBJECTBYCOMMENTID);
            pstmt.setInt(1, comment.getId());
            rs = pstmt.executeQuery();
            List<String> objectList = new ArrayList<>();
            while (rs.next()) {
                objectList.add(rs.getString("object_id"));
            }
            comment.setCommentObjects(objectList);
            rs.close();
            pstmt.close();

            comment.setCommentEntryList(this.findEntryByCommentId(comment.getId()));

            return comment;
        } catch (SQLException e) {
            logger.error(e.getMessage());
            logger.error("Error during Find by uuid of comment: Couldn't connect to database");
            throw new DAOException("Error during Find by uuid of comment: Couldn't connect to database");
        }
    }
}
