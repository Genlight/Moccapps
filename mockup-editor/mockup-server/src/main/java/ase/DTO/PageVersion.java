package ase.DTO;

import javax.validation.constraints.NotBlank;
import java.util.Objects;

public class PageVersion {
    @NotBlank
    private int id;
    private String page_name;
    private int page_width;
    private int page_height;
    private int page_order;
    @NotBlank
    private int projectVersions_id;
    private String page_data;

    public PageVersion(int id, String page_name, int page_height, int page_width, int page_order, int projectVersions_id, String page_data) {

        this.id = id;
        this.page_name=page_name;
        this.page_data=page_data;
        this.page_height=page_height;
        this.page_order=page_order;
        this.page_width=page_width;
        this.projectVersions_id=projectVersions_id;
    }

    public PageVersion() {

    }

    public PageVersion(String page_name, int page_width, int page_height, int page_order, @NotBlank int projectVersions_id, String page_data) {
        this.page_name = page_name;
        this.page_width = page_width;
        this.page_height = page_height;
        this.page_order = page_order;
        this.projectVersions_id = projectVersions_id;
        this.page_data = page_data;
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

    public int getPage_width() {
        return page_width;
    }

    public void setPage_width(int page_width) {
        this.page_width = page_width;
    }

    public int getPage_height() {
        return page_height;
    }

    public void setPage_height(int page_height) {
        this.page_height = page_height;
    }

    public int getPage_order() {
        return page_order;
    }

    public void setPage_order(int page_order) {
        this.page_order = page_order;
    }

    public int getProjectVersions_id() {
        return projectVersions_id;
    }

    public void setProjectVersions_id(int projectVersions_id) {
        this.projectVersions_id = projectVersions_id;
    }

    public String getPage_data() {
        return page_data;
    }

    public void setPage_data(String page_data) {
        this.page_data = page_data;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PageVersion that = (PageVersion) o;

        if (id != that.id) return false;
        if (page_width != that.page_width) return false;
        if (page_height != that.page_height) return false;
        if (page_order != that.page_order) return false;
        if (projectVersions_id != that.projectVersions_id) return false;
        if (page_name != null ? !page_name.equals(that.page_name) : that.page_name != null) return false;
        return page_data != null ? page_data.equals(that.page_data) : that.page_data == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (page_name != null ? page_name.hashCode() : 0);
        result = 31 * result + page_width;
        result = 31 * result + page_height;
        result = 31 * result + page_order;
        result = 31 * result + projectVersions_id;
        result = 31 * result + (page_data != null ? page_data.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "PageVersion{" +
                "id=" + id +
                ", page_name='" + page_name + '\'' +
                ", page_width=" + page_width +
                ", page_height=" + page_height +
                ", page_order=" + page_order +
                ", projectVersions_id=" + projectVersions_id +
                ", page_data='" + page_data + '\'' +
                '}';
    }
}
