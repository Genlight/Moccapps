package ase.DAO.impl;

import ase.DAO.AbstractDAO;
import ase.DAO.DAOException;
import ase.DAO.PageDAO;
import ase.DTO.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotNull;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PageDAOImpl extends AbstractDAO implements PageDAO {

    private static final String PSTMT_CREATE = "INSERT INTO pages (page_name, page_height, page_width, page_order, page_data, project_id) VALUES (?,?,?,?,cast(? AS JSON),?)";
    private static final String PSTMT_UPDATE = "UPDATE pages SET page_name=?, page_height = ?, page_width = ?, page_order=?, page_data=cast(? AS JSON), project_id=? WHERE id=?";
    private static final String PSTMT_DELETE = "DELETE FROM pages WHERE id=?";
    private static final String PSTMT_FINDBYID = "SELECT * FROM pages WHERE id=?";
    private static final String PSTMT_FINDBYPROJECTANDORDER = "SELECT * FROM pages WHERE project_id=? AND page_order=?";
    private static final String PSTMT_FINDBYPROJECTID = "SELECT * FROM pages WHERE project_id=?";
    private PreparedStatement pstmt;

    private static final Logger logger  = LoggerFactory.getLogger(PageDAOImpl.class);
    /**
     * creates a page entry
     * @param  page         Page
     * @return              Page
     * @throws DAOException [description]
     */
    @Override
    public Page create(Page page) throws DAOException {
        if(page==null){
            logger.error("Error during Creation of Page: page is empty");
            throw new DAOException("Error during Creation of Page: page is empty");
        }

        try{
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_CREATE, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1,page.getPage_name());
            pstmt.setInt(2, page.getHeight());
            pstmt.setInt(3, page.getWidth());
            pstmt.setInt(4,page.getPage_order());
            pstmt.setString(5,page.getPage_data());
            pstmt.setInt(6,page.getProject_id());
            pstmt.executeUpdate();

            ResultSet rs=pstmt.getGeneratedKeys();
            rs.next();
            page.setId(rs.getInt(1));
            rs.close();

            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Creation of Page: Couldn't connect to database");
            throw new DAOException("Error during Creation of Page: Couldn't connect to database");
        }
        return page;
    }

    /**
     * updates an existing Page
     * @param  page         Page
     * @return              Page
     * @throws DAOException [description]
     */
    @Override
    public Page update(Page page) throws DAOException {
        if(page==null){
            logger.error("Error during Update of Page: page is empty");
            throw new DAOException("Error during Update of Page: page is empty");
        }

        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_UPDATE);
            pstmt.setString(1,page.getPage_name());
            pstmt.setInt(2, page.getHeight());
            pstmt.setInt(3, page.getWidth());
            pstmt.setInt(4,page.getPage_order());
            pstmt.setString(5,page.getPage_data());
            pstmt.setInt(6,page.getProject_id());
            pstmt.setInt(7,page.getId());
            pstmt.executeUpdate();
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Update of Page: Couldn't connect to database");
            throw new DAOException("Error during Update of Page: Couldn't connect to database");
        }
        return page;
    }

    /**
     * deletes an existing Page
     * @param  page         Page
     * @return              boolean
     * @throws DAOException [description]
     */
    @Override
    public boolean delete(Page page) throws DAOException {
        int success;
        if(page==null || page.getId()<0){
            logger.error("Error during Delete of Page: page is empty or id invalid");
            throw new DAOException("Error during Delete of Page: page is empty or id invalid");
        }

        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_DELETE);
            pstmt.setInt(1,page.getId());
            success=pstmt.executeUpdate();
            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Update of Page: Couldn't connect to database");
            throw new DAOException("Error during Update of Page: Couldn't connect to database");
        }
        return (success>0);
    }

    /**
     * find a Page by a given ID
     * @param  id           Integer
     * @return              Page
     * @throws DAOException [description]
     */
    @Override
    public Page findById(int id) throws DAOException {
        if(id<0){
            logger.error("Error during Find by ID of Page: Invalid ID");
            throw new DAOException("Error during Find by ID of Page: Invalid ID");
        }
        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDBYID);
            pstmt.setInt(1,id);
            ResultSet rs=pstmt.executeQuery();
            Page page = null;
            if (rs.next()) {
                page = new Page(
                        rs.getInt("id"),
                        rs.getString("page_name"),
                        rs.getInt("page_width"),
                        rs.getInt("page_height"),
                        rs.getInt("page_order"),
                        rs.getInt("project_id"),
                        rs.getString("page_data"));
            }
            rs.close();

            return page;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by ID of Page: Couldn't connect to database");
            throw new DAOException("Error during Find by ID of Page: Couldn't connect to database");
        }
    }

    /**
     * find a Page by a given Project and a given order number
     * @param  id           Integer
     * @param  order        Integer
     * @return              Page
     * @throws DAOException [description]
     */
    @Override
    public Page findByProjectAndOrder(int id, int order) throws DAOException {
        if(id<0){
            logger.error("Error during Find by Project and Order of Page: Invalid Project ID");
            throw new DAOException("Error during Find by Project and Order of Page: Invalid Project ID");
        }
        else if(order <0){
            logger.error("Error during Find Project and Order of Page: Invalid Order");
            throw new DAOException("Error during Find by Project and Order of Page: Invalid Order");
        }
        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDBYPROJECTANDORDER);
            pstmt.setInt(1,id);
            pstmt.setInt(2,order);
            ResultSet rs=pstmt.executeQuery();
            Page page = null;
            if (rs.next()) {
                page = new Page(
                        rs.getInt("id"),
                        rs.getString("page_name"),
                        rs.getInt("page_width"),
                        rs.getInt("page_height"),
                        rs.getInt("page_order"),
                        rs.getInt("project_id"),
                        rs.getString("page_data"));
            }
            rs.close();

            return page;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by Project and Order of Page: Couldn't connect to database");
            throw new DAOException("Error during Find by Project and Order of Page: Couldn't connect to database");
        }
    }

    /**
     * gets all Pages by a given ProjectID
     * @param  searchID     Integer
     * @param  queryString  String
     * @return              List<Page>
     * @throws DAOException [description]
     */
    @NotNull
    private List<Page> getPages(int searchID, String queryString) throws DAOException {
        try{
            List<Page> pages=new ArrayList<>();
            getConnection();
            pstmt=connection.prepareStatement(queryString);
            pstmt.setInt(1, searchID);
            ResultSet rs=pstmt.executeQuery();

            while(rs.next()){
                pages.add(new Page(
                        rs.getInt("id"),
                        rs.getString("page_name"),
                        rs.getInt("page_width"),
                        rs.getInt("page_height"),
                        rs.getInt("page_order"),
                        rs.getInt("project_id"),
                        rs.getString("page_data")));
            }
            rs.close();
            pstmt.close();
            return pages;

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find multiple Pages: Couldn't connect to database");
            throw new DAOException("Error during Find multiple Pages: Couldn't connect to database");
        }
    }

    /**
     * s. above function getPages
     * @param  projectID    Integer
     * @return              List<Page>
     * @throws DAOException [description]
     */
    @Override
    public List<Page> findPagesForProject(int projectID) throws DAOException {
        return getPages(projectID, PSTMT_FINDBYPROJECTID);
    }

}
