package ase.DAO.impl;

import ase.DAO.AbstractDAO;
import ase.DAO.DAOException;
import ase.DAO.ProjectDAO;
import ase.DAO.UserDAO;
import ase.DTO.Project;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProjectDAOImpl extends AbstractDAO implements ProjectDAO {

    private static final Logger logger  = LoggerFactory.getLogger(ProjectDAOImpl.class);
    private static final String PSTMT_CREATE = "INSERT INTO projects (project_name) VALUES (?)";
    private static final String PSTMT_CREATE_JT_USERS_PROJECTS="INSERT INTO user_project (user_id,project_id) VALUES (?,?)";
    private static final String PSTMT_UPDATE = "UPDATE projects SET project_name=? WHERE id=?";
    private static final String PSTMT_DELETE = "DELETE FROM projects WHERE id=?";
    private static final String PSTMT_DELETE_JT_USERS_PROJECTS="DELETE FROM user_project WHERE project_id=?";
    private static final String PSTMT_DELETE_JT_USERS_PROJECTS_SINGLE_ENTRY="DELETE FROM user_project WHERE project_id=? AND user_id=?";
    private static final String PSTMT_FINDBYID = "SELECT * FROM projects WHERE id=?";
    private static final String PSTMT_FINDBYID_JT_USERS_PROJECTS="SELECT * FROM user_project WHERE project_id=?";
    private static final String PSTMT_FINDALL = "SELECT * FROM projects";
    private static final String PSTMT_FINDALL_JT_USERS_PROJECTS="SELECT * FROM user_project ORDER BY project_id";
    private static final String PSTMT_DELETE_PAGES="DELETE FROM pages WHERE project_id=?";

    private PreparedStatement pstmt;

    @Autowired
    UserDAO userDAO;

    @Override
    public Project create(Project project) throws DAOException {
        try {
            if(project==null){
                logger.error("Error during Creation of Project: Project is empty");
                throw new DAOException("Error during Creation of Project: Project is empty");
            }
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_CREATE, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1,project.getProjectname());
            pstmt.executeUpdate();
            ResultSet rs=pstmt.getGeneratedKeys();
            rs.next();
            project.setId(rs.getInt(1));
            rs.close();

            for(int user : project.getUsers()){
                pstmt=connection.prepareStatement(PSTMT_CREATE_JT_USERS_PROJECTS);
                pstmt.setInt(1,user);
                pstmt.setInt(2,project.getId());
                pstmt.executeUpdate();
                pstmt.close();
            }
            return project;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Creation of Project: Couldn't connect to database");
            throw new DAOException("Error during Creation of Project: Couldn't connect to database");

        }

    }

    @Override
    public Project update(Project project) throws DAOException {
        if(project==null){
            logger.error("Error during Update of Project: Project is empty");
            throw new DAOException("Error during Update of Project: Project is empty");
        }
        try {
            getConnection();
            List<Integer> userIds=findById(project.getId()).getUsers();
            for (int userId:userIds){
                if(!project.getUsers().contains(userId)){
                    pstmt=connection.prepareStatement(PSTMT_CREATE_JT_USERS_PROJECTS);
                    pstmt.setInt(1,userId);
                    pstmt.setInt(2,project.getId());
                    pstmt.executeUpdate();
                    pstmt.close();
                }
            }

            for(int userId : project.getUsers()){
                if(userIds.contains(userId)){
                    pstmt=connection.prepareStatement(PSTMT_DELETE_JT_USERS_PROJECTS_SINGLE_ENTRY);
                    pstmt.setInt(1,project.getId());
                    pstmt.setInt(2,userId);
                    pstmt.executeUpdate();
                    pstmt.close();
                }
            }

            pstmt=connection.prepareStatement(PSTMT_UPDATE);
            pstmt.setString(1,project.getProjectname());
            pstmt.setInt(2,project.getId());
            pstmt.executeUpdate();
            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Update of Project: Couldn't connect to database");
            throw new DAOException("Error during Update of Project: Couldn't connect to database");
        }
        return project;
    }

    @Override
    public boolean delete(int id) throws DAOException {
        if(id<0){
            logger.error("Error during Delete of Project: Invalid ID");
            throw new DAOException("Error during Delete of Project: Invalid ID");
        }
        try{
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_DELETE_JT_USERS_PROJECTS);
            pstmt.setInt(1,id);
            pstmt.executeUpdate();
            pstmt.close();

            pstmt=connection.prepareStatement(PSTMT_DELETE_PAGES);
            pstmt.setInt(1,1);
            pstmt.executeUpdate();
            pstmt.close();

            pstmt=connection.prepareStatement(PSTMT_DELETE);
            pstmt.setInt(1,id);
            pstmt.executeUpdate();
            pstmt.close();
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Delete of Project: Couldn't connect to database");
            throw new DAOException("Error during Delete of Project: Couldn't connect to database");
        }
        return true;
    }

    @Override
    public Project findById(int id) throws DAOException {
        try{
            getConnection();
            Project project;
            List<Integer> userIds=new ArrayList<>();
            pstmt=connection.prepareStatement(PSTMT_FINDBYID);
            pstmt.setInt(1,id);

            ResultSet rs=pstmt.executeQuery();
            if(!rs.next()){
                return null;
            }
            project = new Project(
                    rs.getInt("id"),
                    rs.getString("project_name")
            );
            rs.close();

            pstmt=connection.prepareStatement(PSTMT_FINDBYID_JT_USERS_PROJECTS);
            pstmt.setInt(1,project.getId());
            logger.error(project.getProjectname());
            rs=pstmt.executeQuery();
            while(rs.next()) {
                userIds.add(rs.getInt("user_id"));
            }
            rs.close();

            project.setUsers(userIds);
            return project;


        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by ID of Project: Couldn't connect to database");
            throw new DAOException("Error during Find by ID of Project: Couldn't connect to database");
        }
    }

    @Override
    public List<Project> findAll() throws DAOException {
        try{
            List<Project> projects=new ArrayList<>();
            List<Project> returnProjects=new ArrayList<>();
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDALL);
            ResultSet rs=pstmt.executeQuery();
            while(rs.next()){
                projects.add(new Project(
                        rs.getInt("id"),
                        rs.getString("project_name")
                ));
            }
            rs.close();
            pstmt.close();

            PreparedStatement pstmtUsers=connection.prepareStatement(PSTMT_FINDALL_JT_USERS_PROJECTS);
            ResultSet rsProjectUsers=pstmtUsers.executeQuery();
            int currentProjectId;
            Project currentProject=null;
            while(rsProjectUsers.next()){
                currentProjectId=rsProjectUsers.getInt("project_id");
                if(currentProject!=null&&currentProject.getId()==currentProjectId){
                    currentProject.addUser(rsProjectUsers.getInt("user_id"));
                    continue;
                }
                for(Project project:projects){
                    if(currentProjectId==project.getId()){
                        if(currentProject!=null) {
                            returnProjects.add(currentProject);
                        }
                        currentProject=project;
                        currentProject.addUser(rsProjectUsers.getInt("user_id"));
                        break;
                    }
                }

            }
            returnProjects.add(currentProject);
            rsProjectUsers.close();
            pstmtUsers.close();

            return returnProjects;

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find all Projects: Couldn't connect to database");
            throw new DAOException("Error during Find all Projects: Couldn't connect to database");
        }

    }
}
