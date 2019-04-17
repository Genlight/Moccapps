package ase.DAO.impl;

import ase.DAO.AbstractDAO;
import ase.DAO.DAOException;
import ase.DAO.PageDAO;
import ase.DTO.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@Repository
public class PageDAOImpl extends AbstractDAO implements PageDAO {

    private static final String PSTMT_CREATE = "INSERT INTO pages (page_name, page_order, page_data, project_id) VALUES (?,?,cast(? AS JSON),?)";
    private static final String PSTMT_UPDATE = "UPDATE pages SET page_name=?, page_order=?, page_data=cast(? AS JSON), project_id=? WHERE id=?";
    private static final String PSTMT_DELETE = "DELETE FROM pages WHERE id=?";
    private static final String PSTMT_FINDBYID = "SELECT * FROM pages WHERE id=?";
    private PreparedStatement pstmt;

    private static final Logger logger  = LoggerFactory.getLogger(PageDAOImpl.class);

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
            pstmt.setInt(2,page.getPage_order());
            pstmt.setString(3,page.getPage_data());
            pstmt.setInt(4,page.getProject_id());
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
            pstmt.setInt(2,page.getPage_order());
            pstmt.setString(3,page.getPage_data());
            pstmt.setInt(4,page.getProject_id());
            pstmt.setInt(5,page.getId());
            pstmt.executeUpdate();
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Update of Page: Couldn't connect to database");
            throw new DAOException("Error during Update of Page: Couldn't connect to database");
        }
        return page;
    }

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
            rs.next();
            Page page=new Page(
                    rs.getInt("id"),
                    rs.getString("page_name"),
                    rs.getInt("page_order"),
                    rs.getInt("project_id"),
                    rs.getString("page_data"));

            rs.close();
            return page;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by ID of Page: Couldn't connect to database");
            throw new DAOException("Error during Find by ID of Page: Couldn't connect to database");
        }
    }
}
