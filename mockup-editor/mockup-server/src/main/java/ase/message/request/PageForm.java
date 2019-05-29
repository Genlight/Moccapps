package ase.message.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

public class PageForm implements Serializable {

    private int id;
    private String page_name;
    private int height;
    private int width;
    private int page_order;
    private int project_id;
    private String page_data;

    public PageForm() {
    }

    public PageForm(String page_name, int height, int width, int page_order, int project_id, String page_data) {
        this.page_name = page_name;
        this.height = height;
        this.width = width;
        this.page_order = page_order;
        this.project_id = project_id;
        this.page_data = page_data;
    }

    public PageForm(int id, String page_name, int height, int width, int page_order, int project_id, String page_data) {
        this.id = id;
        this.page_name = page_name;
        this.height = height;
        this.width = width;
        this.page_order = page_order;
        this.project_id = project_id;
        this.page_data = page_data;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
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

    public int getProject_id() {
        return project_id;
    }

    public void setProject_id(int project_id) {
        this.project_id = project_id;
    }

    public String getPage_data() {
        return page_data;
    }

    public void setPage_data(String page_data) {
        this.page_data = page_data;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
