package ase.DAO;

import ase.DTO.Invitation;

import java.util.List;

public interface InvitationDAO {

    Invitation create(Invitation invitation) throws DAOException;

    boolean update(Invitation invitation) throws DAOException;

    boolean delete(Invitation invitation) throws DAOException;

    Invitation findById(int id) throws DAOException;

    List<Invitation> findInvitationsForProject(int projectID) throws DAOException;

    List<Invitation> findInvitationsForInviter(int invitationrID) throws DAOException;

    List<Invitation> findInvitationsForInvitee(int invitationeID) throws DAOException;
}
