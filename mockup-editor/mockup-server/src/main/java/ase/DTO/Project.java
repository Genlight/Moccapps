package ase.DTO;

import java.util.ArrayList;
import java.util.List;

public class Project {

    private int id;
    private String username;
    private List<User> users;
    private List pages;

    public Project(){
        users=new ArrayList<>();
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

    public List getUsers() {
        return users;
    }

    public void setUsers(List users) {
        this.users = users;
    }

    public void addUser(User user) {
        this.users.add(user);
    }

    public List getPages() {
        return pages;
    }

    public void setPages(List pages) {
        this.pages = pages;
    }
}
