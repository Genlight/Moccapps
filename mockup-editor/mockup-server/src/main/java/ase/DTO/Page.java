package ase.DTO;

public class Page {
    private int id;
    private String page_name;
    private int page_order;
    private int project_id;
    private String page_data;

    public Page(int id, String page_name, int page_order, int project_id,String page_data) {
        this.id=id;
        this.page_name=page_name;
        this.page_order=page_order;
        this.project_id=project_id;
        this.page_data=page_data;
    }

    public Page(String page_name, int page_order, int project_id,String page_data) {
        this.id=-1;
        this.page_name=page_name;
        this.page_order=page_order;
        this.project_id=project_id;
        this.page_data=page_data;
    }

    public Page() {

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

        if (page_order != page.page_order) return false;
        if (project_id != page.project_id) return false;
        if (!page_name.equals(page.page_name)) return false;
        return page_data.equals(page.page_data);
    }

    @Override
    public int hashCode() {
        int result = page_name.hashCode();
        result = 31 * result + page_order;
        result = 31 * result + project_id;
        result = 31 * result + page_data.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "Page{" +
                "id=" + id +
                ", page_name='" + page_name + '\'' +
                ", page_order=" + page_order +
                ", project_id=" + project_id +
                ", page_data='" + page_data + '\'' +
                '}';
    }
}
