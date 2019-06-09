package ase.DTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Project {

    private int id;
    private String projectname;
    private List<Integer> usersId;
    private List<Page> pages;

    public Project(){
        usersId =new ArrayList<>();
    }

    public Project(String username) {
        this.projectname = username;
        usersId =new ArrayList<>();
    }

    public Project(int id, String username) {
        this.id=id;
        this.projectname = username;
        usersId =new ArrayList<>();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getProjectname() {
        return projectname;
    }

    public void setProjectname(String projectname) {
        this.projectname = projectname;
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

    public List<Page> getPages() {
        return pages;
    }

    public void setPages(List pages) {
        this.pages = pages;
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", projectname='" + projectname + '\'' +
                ", users=" + usersId +
                ", pages=" + pages +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Project project = (Project) o;
        return  Objects.equals(projectname, project.projectname) &&
                Objects.equals(usersId, project.usersId) &&
                Objects.equals(pages, project.pages);
    }

}
