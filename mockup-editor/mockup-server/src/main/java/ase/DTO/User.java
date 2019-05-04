package ase.DTO;

import java.util.Objects;

public class User {

    private int id;
    private String username;
    private String email;
    private String password;

    public User(){
        id=-1;
        username=null;
        email=null;
        password=null;
    }

    public User(String username, String email, String password) {
        this.id=-1;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public User(int id, String username, String email, String password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "{" +
                "id:" + id +
                ", username:'" + username + '\'' +
                ", email:'" + email + '\'' +
                ", password:'" + password + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return
                Objects.equals(username, user.username) &&
                Objects.equals(email, user.email) &&
                        Objects.equals(id, user.id);
        //Objects.equals(password, user.password); //Bcrypt encodes passwords differently each time, this is never true
    }

}
