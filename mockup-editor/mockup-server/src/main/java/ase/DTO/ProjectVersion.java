package ase.DTO;

import javax.validation.constraints.NotBlank;

public class ProjectVersion {

    @NotBlank
    private int id;
    private String versionName;
    @NotBlank
    private int projectId;

    public ProjectVersion() {
    }

    public ProjectVersion(@NotBlank int projectId, String versionName) {
        this.versionName = versionName;
        this.projectId = projectId;
    }

    public ProjectVersion(@NotBlank int id, String versionName, @NotBlank int projectId) {
        this.id = id;
        this.versionName = versionName;
        this.projectId = projectId;
    }

    public ProjectVersion(String versionName, @NotBlank int projectId) {
        this.versionName = versionName;
        this.projectId = projectId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getVersionName() {
        return versionName;
    }

    public void setVersionName(String versionName) {
        this.versionName = versionName;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ProjectVersion that = (ProjectVersion) o;

        if (id != that.id) return false;
        if (projectId != that.projectId) return false;
        return versionName != null ? versionName.equals(that.versionName) : that.versionName == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (versionName != null ? versionName.hashCode() : 0);
        result = 31 * result + projectId;
        return result;
    }

    @Override
    public String toString() {
        return "ProjectVersion{" +
                "id=" + id +
                ", versionName='" + versionName + '\'' +
                ", projectId=" + projectId +
                '}';
    }
}

