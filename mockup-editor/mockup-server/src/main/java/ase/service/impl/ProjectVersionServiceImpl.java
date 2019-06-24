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

    /**
     * delete an existing ProjectVersion by a given project version id
     * @param  id Integer
     * @return    boolean
     */
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
    /**
     * create a new Project Version
     * @param  projectVersion ProjectVersion
     * @return                ProjectVersion
     */
    @Override
    public ProjectVersion createProjectVersion(ProjectVersion projectVersion) {
        try {
            return projectVersionDAO.create(projectService.getProjectById(projectVersion.getProjectId()),projectVersion.getVersionName());
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * create a ProjectVersion from a given Project and name / tag the version
     * @param  project Project
     * @param  tag     String
     * @return         ProjectVersion
     */
    @Override
    public ProjectVersion createProjectVersion(Project project, String tag) {
        try {
            return projectVersionDAO.create(project,tag);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * create a ProjectVersion by a given project id
     * @param  projectId Integer
     * @param  tag       String
     * @return           ProjectVersion
     */
    @Override
    public ProjectVersion createProjectVersion(int projectId, String tag) {
        try {
            return projectVersionDAO.create(projectService.getProjectById(projectId),tag);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * return a ProjectVersion by a given id
     * @param  id Integer
     * @return    ProjectVersion
     */
    @Override
    public ProjectVersion getProjectVersionById(int id) {
        try {
            return projectVersionDAO.findById(id);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * return a ProjectVersion by a given tag name
     * @param  tag String
     * @return     ProjectVersion
     */
    @Override
    public ProjectVersion getProjectVersionByTag(String tag) {
        try {
            return projectVersionDAO.findByVersionTag(tag);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * return all ProjectVersion by the project which they originated from,
     * identified by a project id
     * @param  projectId Integer
     * @return           List<ProjectVersion>
     */
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
