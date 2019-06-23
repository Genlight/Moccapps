package ase.DTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public class Comment {
    @JsonIgnore
    private int id;
    @JsonIgnore
    private int page_id;
    @JsonProperty("uuid")
    private String uuid;
    @JsonProperty("isCleared")
    private boolean cleared;
    @JsonProperty("entries")
    private List<CommentEntry> commentEntryList;
    @JsonProperty("objectUuid")
    private List<String> commentObjects;

    public Comment(int page_id,String uuid, boolean cleared,List<CommentEntry> commentEntryList, List<String> commentObjects) {
        this.page_id = page_id;
        this.uuid = uuid;
        this.cleared = cleared;
        this.commentEntryList = commentEntryList;
        this.commentObjects = commentObjects;
    }

    public Comment(int id, int page_id,String uuid, boolean cleared,List<CommentEntry> commentEntryList, List<String> commentObjects) {
        this.id = id;
        this.page_id = page_id;
        this.uuid = uuid;
        this.cleared = cleared;
        this.commentEntryList = commentEntryList;
        this.commentObjects = commentObjects;
    }

    public Comment(int id, int page_id,String uuid, boolean cleared) {
        this.id = id;
        this.page_id = page_id;
        this.uuid = uuid;
        this.cleared = cleared;
        commentEntryList=new ArrayList<>();
        commentObjects=new ArrayList<>();
    }

    public Comment() {
        commentEntryList=new ArrayList<>();
        commentObjects=new ArrayList<>();
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

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Comment comment = (Comment) o;

        if (id != comment.id) return false;
        if (page_id != comment.page_id) return false;
        if (cleared != comment.cleared) return false;
        if (uuid != null ? !uuid.equals(comment.uuid) : comment.uuid != null) return false;
        if (commentEntryList != null ? !commentEntryList.equals(comment.commentEntryList) : comment.commentEntryList != null)
            return false;
        return commentObjects != null ? commentObjects.equals(comment.commentObjects) : comment.commentObjects == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + page_id;
        result = 31 * result + (uuid != null ? uuid.hashCode() : 0);
        result = 31 * result + (cleared ? 1 : 0);
        result = 31 * result + (commentEntryList != null ? commentEntryList.hashCode() : 0);
        result = 31 * result + (commentObjects != null ? commentObjects.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", page_id=" + page_id +
                ", uuid='" + uuid + '\'' +
                ", cleared=" + cleared +
                ", commentEntryList=" + commentEntryList +
                ", commentObjects=" + commentObjects +
                '}';
    }
}
