package ase.DAO.impl;

import ase.DAO.AbstractDAO;
import ase.DAO.DAOException;
import ase.DAO.UserDAO;
import ase.DTO.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UserDAOImpl extends AbstractDAO implements UserDAO {

    private static final Logger logger  = LoggerFactory.getLogger(UserDAOImpl.class);
    private static final String PSTMT_CREATE = "INSERT INTO users (email,username,password) VALUES (?,?,?)";
    private static final String PSTMT_UPDATE = "UPDATE users SET username=?, password=? WHERE id=?";
    private static final String PSTMT_DELETE = "DELETE FROM users WHERE id=?";
    private static final String PSTMT_DELETE_JT_USERS_PROJECTS="DELETE FROM user_project WHERE user_id=?";
    private static final String PSTMT_FINDBYID = "SELECT * FROM users WHERE id=?";
    private static final String PSTMT_FINDBYEMAIL = "SELECT * FROM users WHERE email=?";
    private static final String PSTMT_FINDBYEMAIL_OR_USERNAME = "SELECT * FROM users WHERE email LIKE ? OR username LIKE ?";
    private static final String PSTMT_FINDALL="SELECT * FROM users";
    private PreparedStatement pstmt;

    @Override
    public User create(User user) throws DAOException{
        if(user==null){
            logger.error("Error during Creation of User: User is empty");
            throw new DAOException("Error during Creation of User: User is empty");
        }
        if(findByEmail(user.getEmail())!=null){
            logger.error("Error during Creation of User: E-Mail already exists");
            throw new DAOException("Error during Creation of User: E-Mail already exists");
        }
        try{
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_CREATE, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1,user.getEmail());
            pstmt.setString(2,user.getUsername());
            pstmt.setString(3,user.getPassword());
            pstmt.executeUpdate();

            ResultSet rs=pstmt.getGeneratedKeys();
            rs.next();
            user.setId(rs.getInt(1));
            rs.close();

            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Creation of User: Couldn't connect to database");
            throw new DAOException("Error during Creation of User: Couldn't connect to database");
        }
        return user;

    }

    @Override
    public User update(User user) throws DAOException{
        if(user==null){
            logger.error("Error during Update of User: User is empty");
            throw new DAOException("Error during Update of User: User is empty");
        }
        User checkEmailUser=findByEmail(user.getEmail());
        if(checkEmailUser!=null&&checkEmailUser.getId()!=user.getId()){
            logger.error("Error during Update of User: E-Mail already exists");
            throw new DAOException("Error during Update of User: E-Mail already exists");
        }

        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_UPDATE);
            pstmt.setString(1,user.getUsername());
            pstmt.setString(2,user.getPassword());
            pstmt.setInt(3,user.getId());
            pstmt.executeUpdate();
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Update of User: Couldn't connect to database");
            throw new DAOException("Error during Update of User: Couldn't connect to database");
        }
        return user;
    }

    @Override
    public boolean delete(int id) throws DAOException{
        int success;
        if(id<0){
            logger.error("Error during Delete of User: Invalid ID");
            throw new DAOException("Error during Delete of User: Invalid ID");
        }

        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_DELETE_JT_USERS_PROJECTS);
            pstmt.setInt(1,id);
            pstmt.executeUpdate();
            pstmt.close();


            pstmt=connection.prepareStatement(PSTMT_DELETE);
            pstmt.setInt(1,id);
            success=pstmt.executeUpdate();
            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Delete of User: Couldn't connect to database");
            throw new DAOException("Error during Delete of User: Couldn't connect to database");
        }
        return (success>0);
    }

    @Override
    public User findById(int id) throws DAOException{
        if(id<0){
            logger.error("Error during Find by ID of User: Invalid ID");
            throw new DAOException("Error during Find by ID of User: Invalid ID");
        }
        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDBYID);
            pstmt.setInt(1,id);
            ResultSet rs=pstmt.executeQuery();
            rs.next();
            User user=new User(
                    rs.getInt("id"),
                    rs.getString("username"),
                    rs.getString("email"),
                    rs.getString("password"));
            rs.close();
            return user;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by ID of User: Couldn't connect to database");
            throw new DAOException("Error during Find by ID of User: Couldn't connect to database");
        }
    }

    @Override
    public User findByEmail(String email) throws DAOException{
        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDBYEMAIL);
            pstmt.setString(1,email);
            ResultSet rs=pstmt.executeQuery();


            if(!rs.next()){
                return null;
            }
            User user=new User(
                    rs.getInt("id"),
                    rs.getString("username"),
                    rs.getString("email"),
                    rs.getString("password"));
            rs.close();

            return user;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by email of User: Couldn't connect to database");
            throw new DAOException("Error during Find by email of User: Couldn't connect to database");
        }
    }

    @Override
    public List<User> findAll() throws DAOException {
        List<User> users=new ArrayList<>();
        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDALL);
            ResultSet rs=pstmt.executeQuery();


            while(rs.next()) {
                users.add(new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password")));
            }
            rs.close();
            return users;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by email of User: Couldn't connect to database");
            throw new DAOException("Error during Find by email of User: Couldn't connect to database");
        }
    }

    public List<User> searchByEmailOrUsername(String searchterm) throws DAOException {
        List<User> users = new ArrayList<>();
        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDBYEMAIL_OR_USERNAME);
            pstmt.setString(1, "%"+ searchterm + "%");
            pstmt.setString(2, "%"+ searchterm + "%");
            ResultSet rs = pstmt.executeQuery();

            while(rs.next()) {
                users.add(new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password")));
            }
            rs.close();

            return users;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by email of User: Couldn't connect to database");
            throw new DAOException("Error during Find by email of User: Couldn't connect to database");
        }

    }
}
