package ase.DAO;

import ase.DTO.User;

import java.util.List;

public interface UserDAO {

    /* Creates a new User
     *
     * @param user a userDTO with all information set to create a user (id can be set but will be ignored)
     * @return created User with ID
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    User create(User user) throws DAOException;

    /* Updates a User
     *
     * @param user a userDTO with all information set to update a user
     * @return updated User
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    User update(User user) throws DAOException;

    /* Deletes a User
     *
     * @param id id of the user to be deleted
     * @return true if delete was success, false otherwise
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    boolean delete(int id) throws DAOException;

    /* Find a User by the given id
     *
     * @param id id of the user to be searched in the DB
     * @return userDTO with the given id or null if nothing was found
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    User findById(int id) throws DAOException;

    /* Find a User by the given email
     *
     * @param email email of the user to be searched in the DB
     * @return userDTO with the given email, or null if nothing was found
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    User findByEmail(String email) throws DAOException;

    /* Find all registered Users
     *
     * @return List of Users
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    List<User> findAll() throws DAOException;

    /**
     * Find users by the given searchterm matching the email or the username.
     *
     * @author Yikai Yang
     *
     * @param searchterm the searchterm
     * @return List of Users
     * @throws DAOException if an error occurs during the execution a exception with a corresponding message is thrown
     */
    List<User> searchByEmailOrUsername(String searchterm) throws DAOException;
}
