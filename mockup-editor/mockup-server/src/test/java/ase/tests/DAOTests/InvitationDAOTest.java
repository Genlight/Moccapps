package ase.tests.DAOTests;

import ase.DAO.DAOException;
import ase.DAO.InvitationDAO;
import ase.DTO.Invitation;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.junit.Assert.*;

public class InvitationDAOTest extends AbstractDAOTest  {


    @Autowired
    private InvitationDAO invitationDAO;

    private static final Logger logger = LoggerFactory.getLogger(InvitationDAOTest.class);

    @Test
    public void createInvitationWithValidDataTest() throws DAOException {
        Invitation invitation = testData.invitation2;
        assertEquals("The returned Invitation has to be equal to the created one", invitation, invitationDAO.create(invitation));
    }

    @Test(expected = DAOException.class)
    public void createInvitationWithInValidDataTest() throws DAOException {
        invitationDAO.create(null);
    }

    @Test
    public void updateInvitationWithValidDataTest() throws DAOException {
        Invitation invitation = testData.createdInvitation1;
        Invitation invitationBefore = invitationDAO.findById(1);
        assertEquals(invitation,invitationBefore);
        invitation.setInviter_user_id(2);
        assertTrue(invitationDAO.update(invitation));
        invitation.setInviter_user_id(1);
    }

    @Test(expected = DAOException.class)
    public void updateInvitationWithInValidDataTest() throws DAOException {
        invitationDAO.update(null);
    }


    @Test
    public void deleteInvitationWithValidDataTest() throws DAOException {
        Invitation invitation = testData.createdInvitation1;
        invitation.setId(1);
        assertTrue(invitationDAO.delete(invitation));
    }

    @Test(expected = DAOException.class)
    public void deleteInvitationWithInValidDataTest() throws DAOException {
        Invitation invitation = testData.createdInvitation1;
        invitation.setId(-1);
        invitationDAO.delete(invitation);
    }

    @Test
    public void findInvitationByIDWithValidDataTest() throws DAOException {
        Invitation invitation = testData.createdInvitation1;
        invitation.setId(1);
        Invitation invitation1 = invitationDAO.findById(1);
        assertEquals(invitation, invitation1);
    }

    @Test
    public void findInvitationByInvitationrIDWithValidDataTest() throws DAOException {
        Invitation invitation = testData.createdInvitation1;
        invitation.setId(1);

        Invitation invitation1 = invitationDAO.findById(1);
        assertEquals(invitation, invitation1);

        List<Invitation> invitations= invitationDAO.findInvitationsForInviter(testData.createdInvitation1.getInviter_user_id());
        for(Invitation e: invitations){
            logger.info(e.toString());
        }
        if(!(invitations.contains(testData.createdInvitation1))){
            fail();
        }

    }

    @Test
    public void findInvitationByInviteeIDWithValidDataTest() throws DAOException {
        Invitation invitation = testData.createdInvitation1;
        invitation.setId(1);

        Invitation invitation1 = invitationDAO.findById(1);
        assertEquals(invitation, invitation1);

        List<Invitation> invitations= invitationDAO.findInvitationsForInvitee(testData.createdInvitation1.getInvitee_user_id());
        for(Invitation e: invitations){
            logger.info(e.toString());
        }
        if(!(invitations.contains(testData.createdInvitation1))){
            fail();
        }

    }

    @Test(expected = DAOException.class)
    public void findPageByIDPageWithInValidDataTest() throws DAOException {
        invitationDAO.findById(-1);
    }



}
