package ase.service.impl;

import ase.DAO.DAOException;
import ase.DAO.InvitationDAO;
import ase.DTO.Invitation;
import ase.DTO.User;
import ase.message.request.Invitation.InvitationForm;
import ase.service.InvitationService;
import ase.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InvitationServiceImpl implements InvitationService {

    private static final Logger logger = LoggerFactory.getLogger(InvitationServiceImpl.class);

    @Autowired
    InvitationDAO invitationDAO;

    @Autowired
    UserService userService;

    @Override
    public boolean create(InvitationForm invitationForm) {
        User inviter = userService.getUserByEmail(invitationForm.getInvitorID());

        for(String inviteeEmail:invitationForm.getInviteeEmailList()){
            User invitee = userService.getUserByEmail(inviteeEmail);
            Invitation invitation = new Invitation(invitationForm.getProjectID(),inviter.getId(),invitee.getId(),-1);
            try {
                invitationDAO.create(invitation);
            } catch (DAOException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;

    }

    @Override
    public boolean delete(Invitation invitation) {
        try {
            return invitationDAO.delete(invitation);
        } catch (DAOException e) {
            e.printStackTrace();
        }

        return false;
    }

    @Override
    public boolean acceptInvitation(Invitation invitation) {
        logger.error("ServiceImpl:"+invitation.toString());
        invitation.setStatus(1);
        try {
            return invitationDAO.update(invitation);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean declineInvitation(Invitation invitation) {
        invitation.setStatus(0);
        try {
            return invitationDAO.update(invitation);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<Invitation> getAllInvitationsForInvitedUser(User user) {
        List<Invitation> invitations = new ArrayList<>();
        try {
            invitations= invitationDAO.findInvitationsForInvitee(user.getId());
        } catch (DAOException e) {
            e.printStackTrace();
        }

        return invitations;
    }

    @Override
    public Invitation getInvitationById(int id) {
        try {
            return invitationDAO.findById(id);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
