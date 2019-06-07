package ase.DAO;

import ase.DTO.Project;
import ase.DTO.ProjectVersion;

import java.util.List;

public interface ProjectVersionDAO {
    /**
     * Creates a new Project
     *
     * @param project a projectDTO with all information set to create a project (id can be set but will be ignored)
     * @return created Project with ID
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    ProjectVersion create(Project project,String versionName) throws DAOException;

    /**
     * Updates a Project
     *
     * @param project a projectDTO with all information set to update a project
     * @return updated project
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    //ProjectVersion update(ProjectVersion project) throws DAOException;

    /**
     * Deletes a Project
     *
     * @param id id of the project to be deleted
     * @return true if delete was success, false otherwise
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    boolean delete(int id) throws DAOException;

    /**
     * Find a Project by the given id
     *
     * @param id id of the project to be searched in the DB
     * @return projectDTO with the given id
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    ProjectVersion findById(int id) throws DAOException;


    /**
     * Find a Project by the given project_id
     *
     * @param project_id id of the project to be searched in the DB
     * @return projectDTO with the given id
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    ProjectVersion findByProjectId(int project_id) throws DAOException;

    /**
     * Find a Project by the given tag
     *
     * @param tag tag of the project to be searched in the DB
     * @return projectDTO with the given id
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    ProjectVersion findByVersionTag(String tag) throws DAOException;

    /** Find all projects
     *
     * @return List of all projects
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    List<ProjectVersion> findAll() throws DAOException;

}
