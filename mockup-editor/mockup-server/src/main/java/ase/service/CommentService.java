package ase.service;

import ase.DTO.Comment;
import ase.DTO.CommentEntry;

import java.util.List;

public interface CommentService {
    Comment createComment(Comment comment);

    CommentEntry createCommentEntry(CommentEntry commentEntry);

    Comment createCommentAndEntry(Comment comment);

    Comment updateComment(Comment comment);

    CommentEntry updateCommentEntry(CommentEntry commentEntry);

    boolean removeComment(Comment comment);

    boolean removeCommentEntry(CommentEntry commentEntry);

    Comment findCommentById(int id);

    Comment findCommentByUUID(String uuid);

    List<Comment> findCommentsForPage(int id);

    List<CommentEntry> findCommentEntriesForComment(int id);
}
