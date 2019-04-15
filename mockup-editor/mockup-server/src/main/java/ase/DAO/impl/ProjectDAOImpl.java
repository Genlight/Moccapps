package ase.DAO.impl;

import ase.DAO.AbstractDAO;
import ase.DAO.DAOException;
import ase.DAO.ProjectDAO;
import ase.DTO.Project;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.PreparedStatement;

public class ProjectDAOImpl extends AbstractDAO implements ProjectDAO {

    private static final Logger logger  = LoggerFactory.getLogger(ProjectDAOImpl.class);
    private static final String PSTMT_CREATE = "INSERT INTO projects (project_name) VALUES (?)";
    private static final String PSTMT_UPDATE = "UPDATE projects SET project_name=? WHERE id=?";
    private static final String PSTMT_DELETE = "DELETE FROM projects WHERE id=?";
    private static final String PSTMT_FINDBYID = "SELECT * FROM projects WHERE id=?";
    private static final String PSTMT_CREATE_JT_USERS_PROJECTS="INSERT INTO user_project (user_id,project_id) VALUES (?,?)";
    private static final String PSTMT_DELETE_JT_USERS_PROJECTS="DELETE FROM user_project WHERE project_id=?";
    private static final String PSTMT_FINDBYID_JT_USERS_PROJECTS="SELECT * FROM user_project WHERE project_id=?";
    private PreparedStatement pstmt;

    @Override
    public Project create(Project project) throws DAOException {
        return null;
    }

    @Override
    public Project update(Project project) throws DAOException {
        return null;
    }

    @Override
    public boolean delete(int id) throws DAOException {
        return false;
    }

    @Override
    public Project findById(int id) throws DAOException {
        return null;
    }
}
