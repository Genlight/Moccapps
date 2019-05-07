package ase.service.impl;

import ase.DAO.DAOException;
import ase.DAO.ProjectDAO;
import ase.DTO.Project;
import ase.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Matthias Deimel
 */
@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectDAO projectDAO;

    private static final Logger logger = LoggerFactory.getLogger(ProjectServiceImpl.class);

    @Override
    public List<Project> findProjectByUserId(int userId) {
        List<Project> projects = new ArrayList<>();
        try {
            for (Project project : projectDAO.findAll()) {
                if (project.getUsers() != null && project.getUsers().contains(userId)) {
                    projects.add(project);
                }
            }
            return projects;
        } catch (DAOException e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public boolean deleteProject(int id) {
        try {
            return projectDAO.delete(id);
        } catch (DAOException e) {
            logger.error(e.getMessage());
            return false;
        }
    }

    @Override
    public boolean updateProject(Project project) {
        try {
            projectDAO.update(project);
            return true;
        } catch (DAOException e) {
            logger.error(e.getMessage());
            return false;
        }
    }

    @Override
    public Project createProject(Project project) {
        try {
            return projectDAO.create(project);
        } catch (DAOException e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public Project getProjectById(int id) {
        try {
            return projectDAO.findById(id);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;

    }
}
