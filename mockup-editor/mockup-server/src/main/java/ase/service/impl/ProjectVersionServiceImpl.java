package ase.service.impl;

import ase.DAO.DAOException;
import ase.DAO.ProjectVersionDAO;
import ase.DTO.Project;
import ase.DTO.ProjectVersion;
import ase.service.ProjectService;
import ase.service.ProjectVersionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Matthias Deimel
 */
@Service
public class ProjectVersionServiceImpl implements ProjectVersionService {

    @Autowired
    private ProjectVersionDAO projectVersionDAO;

    @Autowired
    private ProjectService projectService;

    private static final Logger logger = LoggerFactory.getLogger(ProjectVersionServiceImpl.class);


    @Override
    public boolean deleteProjectVersion(int id) {
        try {
            projectVersionDAO.delete(id);
            return true;
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public ProjectVersion createProjectVersion(ProjectVersion projectVersion) {
        try {
            return projectVersionDAO.create(projectService.getProjectById(projectVersion.getProjectId()),projectVersion.getVersionName());
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public ProjectVersion createProjectVersion(Project project, String tag) {
        try {
            return projectVersionDAO.create(project,tag);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public ProjectVersion createProjectVersion(int projectId, String tag) {
        try {
            return projectVersionDAO.create(projectService.getProjectById(projectId),tag);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public ProjectVersion getProjectVersionById(int id) {
        try {
            return projectVersionDAO.findById(id);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public ProjectVersion getProjectVersionByTag(String tag) {
        try {
            return projectVersionDAO.findByVersionTag(tag);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<ProjectVersion> getProjectVersionByProjectId(int projectId) {
        try {
            return projectVersionDAO.findByProjectId(projectId);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
