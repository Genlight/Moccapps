package ase.DTO;

import javax.validation.constraints.NotBlank;
import java.sql.Date;

public class ProjectVersion {

    @NotBlank
    private int id;
    private String versionName;
    private Date lastModified;
    @NotBlank
    private int projectId;

    public ProjectVersion() {
    }

    public ProjectVersion(@NotBlank int projectId, String versionName,Date lastModified) {
        this.versionName = versionName;
        this.projectId = projectId;
        this.lastModified = lastModified;
    }

    public ProjectVersion(@NotBlank int id, String versionName, @NotBlank int projectId,Date lastModified) {
        this.id = id;
        this.versionName = versionName;
        this.projectId = projectId;
        this.lastModified = lastModified;
    }

    public ProjectVersion(String versionName, @NotBlank int projectId,Date lastModified) {
        this.versionName = versionName;
        this.projectId = projectId;
        this.lastModified = lastModified;
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

    public Date getLastModified() {
        return lastModified;
    }

    public void setLastModified(Date lastModified) {
        this.lastModified = lastModified;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ProjectVersion that = (ProjectVersion) o;

        if (id != that.id) return false;
        if (projectId != that.projectId) return false;
        if (versionName != null ? !versionName.equals(that.versionName) : that.versionName != null) return false;
        return lastModified != null ? lastModified.equals(that.lastModified) : that.lastModified == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (versionName != null ? versionName.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        result = 31 * result + projectId;
        return result;
    }

    @Override
    public String toString() {
        return "ProjectVersion{" +
                "id=" + id +
                ", versionName='" + versionName + '\'' +
                ", lastModified=" + lastModified +
                ", projectId=" + projectId +
                '}';
    }
}

