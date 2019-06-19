package ase.DAO;

import ase.DTO.Comment;
import ase.DTO.CommentEntry;

import java.util.List;

public interface CommentDAO {

    Comment create(Comment comment) throws DAOException;

    CommentEntry createEntry(CommentEntry commentEntry) throws DAOException;

    Comment update(Comment comment) throws DAOException;

    CommentEntry updateEntry(CommentEntry commentEntry) throws DAOException;

    boolean delete(Comment comment) throws DAOException;

    boolean deleteEntry(CommentEntry commentEntry) throws DAOException;

    Comment findById(int id) throws DAOException;

    List<CommentEntry> findEntryByCommentId(int id) throws DAOException;

    List<Comment> findCommentsForPage(int pageId) throws DAOException;
}
