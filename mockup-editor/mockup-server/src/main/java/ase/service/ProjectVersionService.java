package ase.service;

import ase.DTO.Project;
import ase.DTO.ProjectVersion;

import java.util.List;

public interface ProjectVersionService {


    boolean deleteProjectVersion(int id);

    ProjectVersion createProjectVersion(ProjectVersion projectVersion);

    ProjectVersion createProjectVersion(Project project,String tag);

    ProjectVersion createProjectVersion(int projectId,String tag);

    ProjectVersion getProjectVersionById(int id);

    ProjectVersion getProjectVersionByTag(String tag);

    List<ProjectVersion> getProjectVersionByProjectId(int projectId);


}

