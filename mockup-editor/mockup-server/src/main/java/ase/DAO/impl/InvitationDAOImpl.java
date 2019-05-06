package ase.DAO.impl;

import ase.DAO.AbstractDAO;
import ase.DAO.DAOException;
import ase.DAO.InvitationDAO;
import ase.DTO.Invitation;
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
public class InvitationDAOImpl extends AbstractDAO implements InvitationDAO {

    private static final Logger logger  = LoggerFactory.getLogger(InvitationDAOImpl.class);
    private static final String PSTMT_CREATE = "INSERT INTO invitations (project_id,inviter_user_id,invitee_user_id,status) VALUES (?,?,?,?)";
    private static final String PSTMT_UPDATE = "UPDATE invitations SET project_id=?, inviter_user_id=?, invitee_user_id=?,status=? WHERE id=?";
    private static final String PSTMT_DELETE = "DELETE FROM invitations WHERE id=?";

    private static final String PSTMT_FINDBYID = "SELECT * FROM invitations WHERE id=?";
    private static final String PSTMT_FINDBYPROJECTID = "SELECT * FROM invitations WHERE project_id=?";
    private static final String PSTMT_FINDBYINVITERID = "SELECT * FROM invitations WHERE inviter_user_id=?";
    private static final String PSTMT_FINDBYINVITEEID = "SELECT * FROM invitations WHERE invitee_user_id=?";
    private static final String PSTMT_FINDALL="SELECT * FROM invitations";
    private PreparedStatement pstmt;



    @Override
    public Invitation create(Invitation invitation) throws DAOException {
        if(invitation==null){
            logger.error("Error during Creation of Invitation: invitation is empty");
            throw new DAOException("Error during Creation of Invitation: invitation is empty");
        }

        try{
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_CREATE, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1,invitation.getProject_id());
            pstmt.setInt(2,invitation.getInviter_user_id());
            pstmt.setInt(3,invitation.getInvitee_user_id());
            pstmt.setInt(4,invitation.getStatus());
            pstmt.executeUpdate();

            ResultSet rs=pstmt.getGeneratedKeys();
            rs.next();
            invitation.setId(rs.getInt(1));
            rs.close();

            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Creation of Invitation: Couldn't connect to database");
            throw new DAOException("Error during Creation of Invitation: Couldn't connect to database");
        }
        return invitation;
    }

    @Override
    public boolean update(Invitation invitation) throws DAOException {
        if(invitation==null){
            logger.error("Error during Update of Invitation: invitation is empty");
            throw new DAOException("Error during Update of Invitation: invitation is empty");
        }

        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_UPDATE);
            pstmt.setInt(1,invitation.getProject_id());
            pstmt.setInt(2,invitation.getInviter_user_id());
            pstmt.setInt(3,invitation.getInvitee_user_id());
            pstmt.setInt(4,invitation.getStatus());
            pstmt.setInt(5,invitation.getId());
            pstmt.executeUpdate();
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Update of Invitation: Couldn't connect to database");
            throw new DAOException("Error during Update of Invitation: Couldn't connect to database");
        }
        return true;
    }

    @Override
    public boolean delete(Invitation invitation) throws DAOException {
        int success;
        if(invitation==null || invitation.getId()<0){
            logger.error("Error during Delete of Invitation: invitation is empty or id invalid");
            throw new DAOException("Error during Delete of Invitation: invitation is empty or id invalid");
        }

        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_DELETE);
            pstmt.setInt(1,invitation.getId());
            success=pstmt.executeUpdate();
            pstmt.close();

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Update of Invitation: Couldn't connect to database");
            throw new DAOException("Error during Update of Invitation: Couldn't connect to database");
        }
        return (success>0);
    }

    @Override
    public Invitation findById(int id) throws DAOException {
        if(id<0){
            logger.error("Error during Find by ID of Invitation: Invalid ID");
            throw new DAOException("Error during Find by ID of Invitation: Invalid ID");
        }
        try {
            getConnection();
            pstmt=connection.prepareStatement(PSTMT_FINDBYID);
            pstmt.setInt(1,id);
            ResultSet rs=pstmt.executeQuery();
            Invitation invitation = null;
            if (rs.next()) {
                invitation = new Invitation(
                        rs.getInt("id"),
                        rs.getInt("project_id"),
                        rs.getInt("inviter_user_id"),
                        rs.getInt("invitee_user_id"),
                        rs.getInt("status"));
            }
            rs.close();

            return invitation;
        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find by ID of Invitation: Couldn't connect to database");
            throw new DAOException("Error during Find by ID of Invitation: Couldn't connect to database");
        }
    }

    @NotNull
    private List<Invitation> getInvitations(int searchID, String queryString) throws DAOException {
        try{
            List<Invitation> invitations=new ArrayList<>();
            getConnection();
            pstmt=connection.prepareStatement(queryString);
            pstmt.setInt(1, searchID);
            ResultSet rs=pstmt.executeQuery();
            while(rs.next()){
                invitations.add(new Invitation(
                        rs.getInt("id"),
                        rs.getInt("project_id"),
                        rs.getInt("inviter_user_id"),
                        rs.getInt("invitee_user_id"),
                        rs.getInt("status")
                ));
            }
            rs.close();
            pstmt.close();
            return invitations;

        }catch (SQLException e){
            logger.error(e.getMessage());
            logger.error("Error during Find multiple Invitation: Couldn't connect to database");
            throw new DAOException("Error during Find multiple Invitations: Couldn't connect to database");
        }
    }

    @Override
    public List<Invitation> findInvitationsForInviter(int invitationrID) throws DAOException {
        return getInvitations(invitationrID, PSTMT_FINDBYINVITERID);
    }

    @Override
    public List<Invitation> findInvitationsForInvitee(int invitationeID) throws DAOException {
        return getInvitations(invitationeID, PSTMT_FINDBYINVITEEID);
    }

    @Override
    public List<Invitation> findInvitationsForProject(int projectID) throws DAOException {
        return getInvitations(projectID, PSTMT_FINDBYPROJECTID);
    }
}
