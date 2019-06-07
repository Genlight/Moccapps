package ase.DTO;

import javax.validation.constraints.NotBlank;
import java.util.List;

public class ProjectVersion {

    @NotBlank
    private int id;
    private String version_name;
    @NotBlank
    private int project_id;

    public ProjectVersion() {
    }

    public ProjectVersion(@NotBlank int project_id,String version_name) {
        this.version_name = version_name;
        this.project_id = project_id;
    }

    public ProjectVersion(@NotBlank int id, String version_name, @NotBlank int project_id) {
        this.id = id;
        this.version_name = version_name;
        this.project_id = project_id;
    }

    public ProjectVersion(String version_name, @NotBlank int project_id) {
        this.version_name = version_name;
        this.project_id = project_id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getVersion_name() {
        return version_name;
    }

    public void setVersion_name(String version_name) {
        this.version_name = version_name;
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

        ProjectVersion that = (ProjectVersion) o;

        if (id != that.id) return false;
        if (project_id != that.project_id) return false;
        return version_name != null ? version_name.equals(that.version_name) : that.version_name == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (version_name != null ? version_name.hashCode() : 0);
        result = 31 * result + project_id;
        return result;
    }

    @Override
    public String toString() {
        return "ProjectVersion{" +
                "id=" + id +
                ", version_name='" + version_name + '\'' +
                ", project_id=" + project_id +
                '}';
    }
}

