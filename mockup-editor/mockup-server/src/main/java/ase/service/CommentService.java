package ase.service;

import ase.DTO.Comment;
import ase.DTO.CommentEntry;

import java.util.List;

public interface CommentService {
    Comment createComment(Comment comment);

    CommentEntry createCommentEntry(CommentEntry commentEntry);

    Comment createCommentAndEntry(Comment comment);

    Comment upadteComment(Comment comment);

    CommentEntry updateCommentEntry(CommentEntry commentEntry);

    boolean removeComment(Comment comment);

    boolean deleteCommentEntry(CommentEntry commentEntry);

    Comment findCommentById(int id);

    List<Comment> findCommentsForPage(int id);

    List<CommentEntry> findCommentEntriesForComment(int id);
}
