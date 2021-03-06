package ase.DAO.impl;

import ase.DAO.*;
import ase.DTO.Page;
import ase.DTO.Project;
import ase.DTO.ProjectVersion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Repository
public class ProjectVersionDAOImpl  extends AbstractDAO implements ProjectVersionDAO {

    private static final Logger logger  = LoggerFactory.getLogger(ProjectDAOImpl.class);
    private static final String PSTMT_CREATE = "INSERT INTO projectVersions (version_name,project_id,last_modified) VALUES (?,?,?)";
    private static final String PSTMT_DELETE = "DELETE FROM projectVersions WHERE id=?";
    private static final String PSTMT_FINDBYID = "SELECT * FROM projectVersions WHERE id=?";
    private static final String PSTMT_FINDBYPROJECTID = "SELECT * FROM projectVersions WHERE project_id=?";
    private static final String PSTMT_FINDBYVERSIONNAME = "SELECT * FROM projectVersions WHERE version_name=?";
    private static final String PSTMT_FINDALL = "SELECT * FROM projectVersions";
    private static final String PSTMT_DELETE_PAGES="DELETE FROM pageVersions WHERE projectVersions_id=?";

    private PreparedStatement pstmt;

    @Autowired
    UserDAO userDAO;

    @Autowired
    PageVersionDAO pageVersionDAO;

    @Autowired
    PageDAO pageDAO;

    /**
     * creates an entry for a ProjectVersion and set a name
     * @param  project      ProjectVersion
     * @param  versionName  string
     * @return              ProjectVersion
     * @throws DAOException [description]
     */
    @Override
    public ProjectVersion create(Project project,String versionName) throws DAOException {
        try {
            ProjectVersion projectVersion = new ProjectVersion();
            if(project==null){
                logger.error("Error during Creation of ProjectVersion: ProjectVersion is empty");
                throw new DAOException("Error during Creation of ProjectVersion: ProjectVersion is empty");
            }
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_CREATE, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1,versionName);
            pstmt.setInt(2,project.getId());
            pstmt.setDate(3,project.getLastModified());
            pstmt.executeUpdate();
            ResultSet rs=pstmt.getGeneratedKeys();
            rs.next();
            projectVersion.setId(rs.getInt(1));
            projectVersion.setVersionName(rs.getString(2));
            projectVersion.setProjectId(rs.getInt(3));
            projectVersion.setLastModified(rs.getDate(4));
            rs.close();

            List<Page> pages = pageDAO.findPagesForProject(project.getId());
            pages.sort(Comparator.comparing(Page::getId));
            for(Page p:pages){
                logger.info("Create Version:"+p.getId());
                pageVersionDAO.create(p,projectVersion.getId());
            }

            return projectVersion;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Creation of ProjectVersion: Couldn't connect to database");
            throw new DAOException("Error during Creation of ProjectVersion: Couldn't connect to database");

        }

    }

    /**
     * deletes an existing ProjectVersion by ID
     * @param  id           Integer
     * @return              boolean
     * @throws DAOException [description]
     */
    @Override
    public boolean delete(int id) throws DAOException {
        if(id<0){
            logger.error("Error during Delete of Project: Invalid ID");
            throw new DAOException("Error during Delete of Project: Invalid ID");
        }
        try{
            getConnection();

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

    /**
     * find a ProjectVersion by ID
     * @param  id           Integer
     * @return              ProjectVersion
     * @throws DAOException [description]
     */
    @Override
    public ProjectVersion findById(int id) throws DAOException {
        try{
            getConnection();
            ProjectVersion projectVersion;
            pstmt=connection.prepareStatement(PSTMT_FINDBYID);
            pstmt.setInt(1,id);

            ResultSet rs=pstmt.executeQuery();
            if(!rs.next()){
                return null;
            }
            projectVersion = new ProjectVersion(
                    rs.getInt("id"),
                    rs.getString("version_name"),
                    rs.getInt("project_id"),
                    rs.getDate("last_modified")
            );
            rs.close();

            return projectVersion;


        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by ID of Project: Couldn't connect to database");
            throw new DAOException("Error during Find by ID of Project: Couldn't connect to database");
        }
    }

    /**
     * find ProjectVersions by a given Project ID
     * @param  project_id   Integer
     * @return              List<ProjectVersion>
     * @throws DAOException [description]
     */
    @Override
    public List<ProjectVersion> findByProjectId(int project_id) throws DAOException {
        try{
            List<ProjectVersion> projectVersions=new ArrayList<>();
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDBYPROJECTID);
            pstmt.setInt(1,project_id);
            ResultSet rs=pstmt.executeQuery();
            while(rs.next()){
                projectVersions.add(new ProjectVersion(
                        rs.getInt("id"),
                        rs.getString("version_name"),
                        rs.getInt("project_id"),
                        rs.getDate("last_modified")
                ));
            }
            rs.close();
            pstmt.close();

            return projectVersions;

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find all Projects: Couldn't connect to database");
            throw new DAOException("Error during Find all Projects: Couldn't connect to database");
        }

    }

    /**
     * find a ProjectVersion by a given Project Tag, set prev. as Name
     * @param  tag          String
     * @return              ProjectVersion
     * @throws DAOException [description]
     */
    @Override
    public ProjectVersion findByVersionTag(String tag) throws DAOException {
        try{
            getConnection();
            ProjectVersion projectVersion;
            pstmt=connection.prepareStatement(PSTMT_FINDBYVERSIONNAME);
            pstmt.setString(1,tag);

            ResultSet rs=pstmt.executeQuery();
            if(!rs.next()){
                return null;
            }
            projectVersion = new ProjectVersion(
                    rs.getInt("id"),
                    rs.getString("version_name"),
                    rs.getInt("project_id"),
                    rs.getDate("last_modified")
            );
            rs.close();

            return projectVersion;


        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by ID of Project: Couldn't connect to database");
            throw new DAOException("Error during Find by ID of Project: Couldn't connect to database");
        }
    }
    /**
     * return all ProjectVersions
     * @return List<ProjectVersion>
     * @throws DAOException  [description]
     */
    @Override
    public List<ProjectVersion> findAll() throws DAOException {
        try{
            List<ProjectVersion> projectVersions=new ArrayList<>();
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDALL);
            ResultSet rs=pstmt.executeQuery();
            while(rs.next()){
                projectVersions.add(new ProjectVersion(
                        rs.getInt("id"),
                        rs.getString("version_name"),
                        rs.getInt("project_id"),
                        rs.getDate("last_modified")
                ));
            }
            rs.close();
            pstmt.close();

            return projectVersions;

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find all Projects: Couldn't connect to database");
            throw new DAOException("Error during Find all Projects: Couldn't connect to database");
        }

    }

}
