package ase.DTO;

import java.sql.Date;

public class CommentEntry{
    private int id;
    private String message;
    private int user_id;
    private Date date;
    private int commentId;

    public CommentEntry(int id, String message, int user_id, Date date,int commentId) {
        this.id = id;
        this.message = message;
        this.user_id = user_id;
        this.date = date;
        this.commentId=commentId;
    }

    public CommentEntry(String message, int user_id, Date date) {
        this.message = message;
        this.user_id = user_id;
        this.date = date;
        this.commentId=commentId;
    }

    public CommentEntry() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getCommentId() {
        return commentId;
    }

    public void setCommentId(int commentId) {
        this.commentId = commentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CommentEntry that = (CommentEntry) o;

        if (id != that.id) return false;
        if (user_id != that.user_id) return false;
        if (commentId != that.commentId) return false;
        if (message != null ? !message.equals(that.message) : that.message != null) return false;
        return date != null ? date.equals(that.date) : that.date == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (message != null ? message.hashCode() : 0);
        result = 31 * result + user_id;
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + commentId;
        return result;
    }

    @Override
    public String toString() {
        return "CommentEntry{" +
                "id=" + id +
                ", message='" + message + '\'' +
                ", user_id=" + user_id +
                ", date=" + date +
                ", commentId=" + commentId +
                '}';
    }
}
