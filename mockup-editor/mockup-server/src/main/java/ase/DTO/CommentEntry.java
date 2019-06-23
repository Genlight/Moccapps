package ase.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Timestamp;

public class CommentEntry{
    @JsonIgnore
    private int id;
    @JsonProperty("id")
    private String uuid;
    @JsonProperty("message")
    private String message;
    @JsonIgnore
    private User user;
    private String email;
    private String username;
    @JsonProperty("date")
    private Timestamp date;
    @JsonIgnore
    private int commentId;

    public CommentEntry(int id, String message, User user, Timestamp date, int commentId, String uuid) {
        this.id = id;
        this.message = message;
        this.user = user;
        this.date = date;
        this.commentId=commentId;
        this.uuid = uuid;
    }

    public CommentEntry(String message, User user, Timestamp date, String uuid) {
        this.message = message;
        this.user = user;
        this.date = date;
        this.uuid = uuid;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public int getCommentId() {
        return commentId;
    }

    public void setCommentId(int commentId) {
        this.commentId = commentId;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getEmail() {
        return user.getEmail();
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return user.getUsername();
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CommentEntry that = (CommentEntry) o;

        if (commentId != that.commentId) return false;
        if (uuid != null ? !uuid.equals(that.uuid) : that.uuid != null) return false;
        if (message != null ? !message.equals(that.message) : that.message != null) return false;
        if (user != null ? !user.equals(that.user) : that.user != null) return false;
        if (email != null ? !email.equals(that.email) : that.email != null) return false;
        if (username != null ? !username.equals(that.username) : that.username != null) return false;
        return date != null ? date.equals(that.date) : that.date == null;
    }

    @Override
    public int hashCode() {
        int result = message != null ? message.hashCode() : 0;
        result = 31 * result + (user != null ? user.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (username != null ? username.hashCode() : 0);
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + commentId;
        return result;
    }

    @Override
    public String toString() {
        return "CommentEntry{" +
                "id=" + id +
                ", uuid='" + uuid + '\'' +
                ", message='" + message + '\'' +
                ", user=" + user +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", date=" + date +
                ", commentId=" + commentId +
                '}';
    }
}
