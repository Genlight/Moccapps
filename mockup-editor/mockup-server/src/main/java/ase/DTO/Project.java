package ase.DTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Project {

    private int id;
    private String username;
    private List<Integer> usersId;
    private List pages;

    public Project(){
        usersId =new ArrayList<>();
    }

    public Project(String username) {
        this.username = username;
        usersId =new ArrayList<>();
    }

    public Project(int id, String username) {
        this.id=id;
        this.username = username;
        usersId =new ArrayList<>();
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

    public List<Integer> getUsers() {
        return usersId;
    }

    public void setUsers(List users) {
        this.usersId = users;
    }

    public void addUser(int user) {
        this.usersId.add(user);
    }

    public List getPages() {
        return pages;
    }

    public void setPages(List pages) {
        this.pages = pages;
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", users=" + usersId +
                ", pages=" + pages +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Project project = (Project) o;
        return  Objects.equals(username, project.username) &&
                Objects.equals(usersId, project.usersId) &&
                Objects.equals(pages, project.pages);
    }

}
