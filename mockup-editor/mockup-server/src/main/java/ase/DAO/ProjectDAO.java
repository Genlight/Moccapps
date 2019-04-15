package ase.DAO;

import ase.DTO.Project;

public interface ProjectDAO {
    /* Creates a new Project
     *
     * @param project a projectDTO with all information set to create a project (id can be set but will be ignored)
     * @return created Project with ID
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    Project create(Project project) throws DAOException;

    /* Updates a Project
     *
     * @param project a projectDTO with all information set to update a project
     * @return updated project
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    Project update(Project project) throws DAOException;

    /* Deletes a Project
     *
     * @param id id of the project to be deleted
     * @return true if delete was success, false otherwise
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    boolean delete(int id) throws DAOException;

    /* Find a Project by the given id
     *
     * @param id id of the project to be searched in the DB
     * @return projectDTO with the given id
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    Project findById(int id) throws DAOException;

}
