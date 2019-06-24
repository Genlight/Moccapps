package ase.DAO.impl;

import ase.DAO.AbstractDAO;
import ase.DAO.DAOException;
import ase.DAO.PageVersionDAO;
import ase.DTO.Page;
import ase.DTO.PageVersion;
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
public class PageVersionDAOImpl  extends AbstractDAO implements PageVersionDAO {

    private static final String PSTMT_CREATE = "INSERT INTO pageVersions (page_name, page_height, page_width, page_order, page_data, projectVersions_id) VALUES (?,?,?,?,cast(? AS JSON),?)";
    private static final String PSTMT_UPDATE = "UPDATE pageVersions SET page_name=?, page_height = ?, page_width = ?, page_order=?, page_data=cast(? AS JSON), projectVersions_id=? WHERE id=?";
    private static final String PSTMT_DELETE = "DELETE FROM pageVersions WHERE id=?";
    private static final String PSTMT_FINDBYID = "SELECT * FROM pageVersions WHERE id=?";
    private static final String PSTMT_FINDBYPROJECTANDORDER = "SELECT * FROM pageVersions WHERE projectVersions_id=? AND page_order=?";
    private static final String PSTMT_FINDBYPROJECTVERSIONID = "SELECT * FROM pageVersions WHERE projectVersions_id=?";
    private PreparedStatement pstmt;

    private static final Logger logger  = LoggerFactory.getLogger(PageVersionDAOImpl.class);

    /**
     * creates a version from a given Page, identified by ID
     * @param  page         Page
     * @param  id           Integer
     * @return              PageVersion
     * @throws DAOException [description]
     */
    @Override
    public PageVersion create(Page page, int id) throws DAOException {
        if(page==null){
            logger.error("Error during Creation of Page: page is empty");
            throw new DAOException("Error during Creation of Page: page is empty");
        }

        try{
            PageVersion pageVersion = new PageVersion();

            getConnection();
            pstmt=connection.prepareStatement(PSTMT_CREATE, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1,page.getPage_name());
            pstmt.setInt(2, page.getHeight());
            pstmt.setInt(3, page.getWidth());
            pstmt.setInt(4,page.getPage_order());
            pstmt.setString(5,page.getPage_data());
            pstmt.setInt(6,id);
            pstmt.executeUpdate();

            ResultSet rs=pstmt.getGeneratedKeys();
            rs.next();
            page.setId(rs.getInt(1));

            pageVersion.setId(page.getId());
            pageVersion.setPage_data(page.getPage_data());
            pageVersion.setPage_height(page.getHeight());
            pageVersion.setPage_width(page.getWidth());
            pageVersion.setPage_name(page.getPage_name());
            pageVersion.setPage_order(page.getPage_order());
            pageVersion.setProjectVersions_id(page.getProject_id());
            rs.close();

            pstmt.close();
            return pageVersion;

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Creation of Page: Couldn't connect to database");
            throw new DAOException("Error during Creation of Page: Couldn't connect to database");
        }
    }
    /**
     * update an existing Page version
     * @param  page         PageVersion
     * @return              PageVersion
     * @throws DAOException [description]
     */
    @Override
    public PageVersion update(PageVersion page) throws DAOException {
        if(page==null){
            logger.error("Error during Update of Page: page is empty");
            throw new DAOException("Error during Update of Page: page is empty");
        }

        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_UPDATE);
            pstmt.setString(1,page.getPage_name());
            pstmt.setInt(2, page.getPage_height());
            pstmt.setInt(3, page.getPage_width());
            pstmt.setInt(4,page.getPage_order());
            pstmt.setString(5,page.getPage_data());
            pstmt.setInt(6,page.getProjectVersions_id());
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
     * deletes a Page version
     * @param  page         PageVersion
     * @return              boolean
     * @throws DAOException [description]
     */
    @Override
    public boolean delete(PageVersion page) throws DAOException {
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
     * finds a PageVersion by ID
     * @param  id           Integer
     * @return              PageVersion
     * @throws DAOException [description]
     */
    @Override
    public PageVersion findById(int id) throws DAOException {
        if(id<0){
            logger.error("Error during Find by ID of Page: Invalid ID");
            throw new DAOException("Error during Find by ID of Page: Invalid ID");
        }
        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDBYID);
            pstmt.setInt(1,id);
            ResultSet rs=pstmt.executeQuery();
            PageVersion page = null;
            if (rs.next()) {
                page = new PageVersion(
                        rs.getInt("id"),
                        rs.getString("page_name"),
                        rs.getInt("page_height"),
                        rs.getInt("page_width"),
                        rs.getInt("page_order"),
                        rs.getInt("projectVersions_id"),
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
     * finds and return a Pageverion by Project(ID) and a given ID
     * @param  id           Integer
     * @param  order        Integer
     * @return              PageVersion
     * @throws DAOException [description]
     */
    @Override
    public PageVersion findByProjectAndOrder(int id, int order) throws DAOException {
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
            PageVersion page = null;
            if (rs.next()) {
                page = new PageVersion(
                        rs.getInt("id"),
                        rs.getString("page_name"),
                        rs.getInt("page_height"),
                        rs.getInt("page_width"),
                        rs.getInt("page_order"),
                        rs.getInt("projectVersions_id"),
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
     * returns PageVersions by given a Page ID
     * @param  searchID     Integer
     * @param  queryString  string
     * @return              List<PageVersion>
     * @throws DAOException [description]
     */
    @NotNull
    private List<PageVersion> getPages(int searchID, String queryString) throws DAOException {
        try{
            List<PageVersion> pages=new ArrayList<>();
            getConnection();
            pstmt=connection.prepareStatement(queryString);
            pstmt.setInt(1, searchID);
            ResultSet rs=pstmt.executeQuery();

            while(rs.next()){
                pages.add(new PageVersion(
                        rs.getInt("id"),
                        rs.getString("page_name"),
                        rs.getInt("page_height"),
                        rs.getInt("page_width"),
                        rs.getInt("page_order"),
                        rs.getInt("projectVersions_id"),
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
     * s. function getPages
     * @param  projectID    Integer
     * @return              List<PageVersion>
     * @throws DAOException [description]
     */
    @Override
    public List<PageVersion> findPagesForProject(int projectID) throws DAOException {
        return getPages(projectID, PSTMT_FINDBYPROJECTVERSIONID);
    }

}
