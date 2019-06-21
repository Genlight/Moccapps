package ase.DTO;

import java.util.List;
import java.util.Objects;

public class Page {
    private int id;
    private String page_name;
    private int width;
    private int height;
    private int page_order;
    private int project_id;
    private String page_data;

    public Page(String page_name, int width, int height, int page_order, int project_id, String page_data) {
        this.id=-1;
        this.page_name = page_name;
        this.width = width;
        this.height = height;
        this.page_order = page_order;
        this.project_id = project_id;
        this.page_data = page_data;
    }

    public Page(int id, String page_name, int width, int height, int page_order, int project_id, String page_data) {
        this.id = id;
        this.page_name = page_name;
        this.width = width;
        this.height = height;
        this.page_order = page_order;
        this.project_id = project_id;
        this.page_data = page_data;
    }

    public Page() {
        this.id=-1;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPage_name() {
        return page_name;
    }

    public void setPage_name(String page_name) {
        this.page_name = page_name;
    }

    public int getPage_order() {
        return page_order;
    }

    public void setPage_order(int page_order) {
        this.page_order = page_order;
    }

    public String getPage_data() {
        return page_data;
    }

    public void setPage_data(String page_data) {
        this.page_data = page_data;
    }

    public int getProject_id() {
        return project_id;
    }

    public void setProject_id(int project_id) {
        this.project_id = project_id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Page page = (Page) o;

        if (id != page.id) return false;
        if (width != page.width) return false;
        if (height != page.height) return false;
        if (page_order != page.page_order) return false;
        if (project_id != page.project_id) return false;
        if (page_name != null ? !page_name.equals(page.page_name) : page.page_name != null) return false;
        return page_data != null ? page_data.equals(page.page_data) : page.page_data == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (page_name != null ? page_name.hashCode() : 0);
        result = 31 * result + width;
        result = 31 * result + height;
        result = 31 * result + page_order;
        result = 31 * result + project_id;
        result = 31 * result + (page_data != null ? page_data.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Page{" +
                "id=" + id +
                ", page_name='" + page_name + '\'' +
                ", width=" + width +
                ", height=" + height +
                ", page_order=" + page_order +
                ", project_id=" + project_id +
                ", page_data='" + page_data + '\'' +
                '}';
    }
}
