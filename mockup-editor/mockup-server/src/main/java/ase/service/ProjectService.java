package ase.service;

import ase.DTO.Project;
import com.sun.org.apache.xpath.internal.operations.Bool;

import java.util.List;

/**
 * @author Matthias Deimel
 */
public interface ProjectService {

    /**
     * returns a list of project ids in which the given user participates
     *
     * @param userId id of the user
     * @return list of projects
     */
    List<Project> findProjectByUserId(int userId);

    /**
     * deletes the project with the given id
     * @param id id of the project to be deleted
     * @return true on success, false otherwise
     */
    boolean deleteProject(int id);

    /**
     * updates the given project
     *
     * @param project to be updated
     * @return true on success, false otherwise
     */
    boolean updateProject(Project project);

    /**
     * persists the given project
     *
     * @param project to be created
     * @return true on success, false otherwise
     */
    boolean createProject(Project project);

    Project getProjectById(int id);


}

