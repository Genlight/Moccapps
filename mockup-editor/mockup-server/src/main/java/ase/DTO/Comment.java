package ase.DTO;

import java.util.ArrayList;
import java.util.List;

public class Comment {
    private int id;
    private int page_id;
    private boolean cleared;
    private List<CommentEntry> commentEntryList;
    private List<String> commentObjects;

    public Comment(int page_id, boolean cleared,List<CommentEntry> commentEntryList, List<String> commentObjects) {
        this.page_id = page_id;
        this.cleared = cleared;
        this.commentEntryList = commentEntryList;
        this.commentObjects = commentObjects;
    }

    public Comment(int id, int page_id, boolean cleared,List<CommentEntry> commentEntryList, List<String> commentObjects) {
        this.id = id;
        this.page_id = page_id;
        this.cleared = cleared;
        this.commentEntryList = commentEntryList;
        this.commentObjects = commentObjects;
    }

    public Comment(int id, int page_id, boolean cleared) {
        this.id = id;
        this.page_id = page_id;
        this.cleared = cleared;
        commentEntryList=new ArrayList<>();
        commentObjects=new ArrayList<>();
    }

    public Comment() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPage_id() {
        return page_id;
    }

    public void setPage_id(int page_id) {
        this.page_id = page_id;
    }

    public boolean isCleared() {
        return cleared;
    }

    public void setCleared(boolean cleared) {
        this.cleared = cleared;
    }

    public List<CommentEntry> getCommentEntryList() {
        return commentEntryList;
    }

    public void setCommentEntryList(List<CommentEntry> commentEntryList) {
        this.commentEntryList = commentEntryList;
    }

    public List<String> getCommentObjects() {
        return commentObjects;
    }

    public void setCommentObjects(List<String> commentObjects) {
        this.commentObjects = commentObjects;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Comment comment = (Comment) o;

        if (id != comment.id) return false;
        if (page_id != comment.page_id) return false;
        if (cleared != comment.cleared) return false;
        return commentObjects != null ? commentObjects.equals(comment.commentObjects) : comment.commentObjects == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + page_id;
        result = 31 * result + (cleared ? 1 : 0);
        result = 31 * result + (commentObjects != null ? commentObjects.hashCode() : 0);
        return result;
    }
}
