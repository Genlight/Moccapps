package ase.service.impl;

import ase.DAO.DAOException;
import ase.DAO.InvitationDAO;
import ase.DTO.Invitation;
import ase.DTO.Project;
import ase.DTO.User;
import ase.message.request.Invitation.InvitationForm;
import ase.service.InvitationService;
import ase.service.ProjectService;
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

    @Autowired
    ProjectService projectService;

    /**
     * creates a new Invitation in db, given the Invitation information and a username, who invites
     * @param  invitationForm InvitationForm
     * @param  username       String
     * @return                boolean
     */
    @Override
    public boolean create(InvitationForm invitationForm, String username) {
        User inviter = userService.getUserByEmail(username);
        for(String inviteeEmail:invitationForm.getInviteeEmailList()){
            User invitee = userService.getUserByEmail(inviteeEmail);
            Invitation invitation = new Invitation(invitationForm.getProjectID(),inviter.getId(),invitee.getId(),-1);
            try {
                invitationDAO.create(invitation);
            } catch (DAOException e) {
                logger.error(e.getMessage());
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    /**
     * deletes an invitation, if it exists
     * @param  invitation Invitation
     * @return            boolean
     */
    @Override
    public boolean delete(Invitation invitation) {
        try {
            return invitationDAO.delete(invitation);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return false;
    }
    /**
     * is called, if a user accepts an invitation by another user<
     * @param  invitation Invitation
     * @return            boolean
     */
    @Override
    public boolean acceptInvitation(Invitation invitation) {
        invitation.setStatus(1);
        try {
            //Add user to project's users field
            Invitation invite = invitationDAO.findById(invitation.getId());
            Project project = this.projectService.getProjectById(invite.getProject_id());
            project.addUser(invite.getInvitee_user_id());
            projectService.updateProject(project);

            return invitationDAO.update(invitation);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return false;
    }
    /**
     * is called, when a user declines an existing invitation
     * @param  invitation Invitation
     * @return            boolean
     */
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

    /**
     * returns all open (not declined) invitations for a given user
     * @param  user User
     * @return      List<Invitation>
     */
    @Override
    public List<Invitation> getAllInvitationsForInvitedUser(User user) {
        List<Invitation> invitations = new ArrayList<>();
        try {
            invitations= invitationDAO.findInvitationsForInvitee(user.getId());
        } catch (DAOException e) {
            e.printStackTrace();
        }
        List<Invitation> resultInvitations = new ArrayList<>();
        for (Invitation e : invitations) {
            if (e.getStatus() == -1) {
                resultInvitations.add(e);
            }
        }
        return resultInvitations;
    }

    /**
     * returns all Invitation concnerning a given Project
     * @param  project Project
     * @return         List<Invitation>
     */
    @Override
    public List<Invitation> getAllInvitationsForProject(Project project) {
        List<Invitation> invitations = new ArrayList<>();
        try {
            invitations = invitationDAO.findInvitationsForProject(project.getId());
        } catch (DAOException e) {
            e.printStackTrace();
        }
        List<Invitation> resultInvitations = new ArrayList<>();
        for (Invitation e : invitations) {
            if (e.getStatus() == -1) {
                resultInvitations.add(e);
            }
        }
        return resultInvitations;
    }
    /**
     * get a Invitation by a given ID
     * @param  id Integer
     * @return    Invitation
     */
    @Override
    public Invitation getInvitationById(int id) {
        try {
            return invitationDAO.findById(id);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * update an existing Invitation with information given through the invitation forms
     * @param  invitationForm InvitationForm
     * @param  inviterEmail   String
     * @return                boolean
     */
    @Override
    public boolean update(InvitationForm invitationForm, String inviterEmail) {
        User inviter = userService.getUserByEmail(inviterEmail);
        List<Invitation> currentInvitationList = new ArrayList<>();
        List<User> currentInvitationUserList = new ArrayList<>();

        List<User> newInvitationUserList = new ArrayList<>();
        try {
            currentInvitationList = invitationDAO.findInvitationsForProject(invitationForm.getProjectID());
        } catch (DAOException e) {
            e.printStackTrace();
        }

        for (Invitation e : currentInvitationList) {
            currentInvitationUserList.add(userService.findUserByID(e.getInvitee_user_id()));
        }

        for (String inviteeEmail : invitationForm.getInviteeEmailList()) {
            User invitee = userService.getUserByEmail(inviteeEmail);
            newInvitationUserList.add(invitee);
        }

        for (User invitee : newInvitationUserList) {
            if (!currentInvitationUserList.contains(invitee)) {  //user is in new and not in current -> create invitation
                Invitation invitation = new Invitation(invitationForm.getProjectID(), inviter.getId(), invitee.getId(), -1);
                logger.info("Create new Invitation:" + invitation.toString());
                try {
                    invitationDAO.create(invitation);
                } catch (DAOException e) {
                    e.printStackTrace();
                    return false;
                }
            }
        }

        for (User e : currentInvitationUserList) {
            if (!newInvitationUserList.contains(e)) { //User is in current list but not in new -> invitation deleted
                for (Invitation f : currentInvitationList) {
                    if (f.getInvitee_user_id() == e.getId()) {
                        logger.info("Delete Invitation:" + f.toString());
                        try {
                            invitationDAO.delete(f);
                        } catch (DAOException e1) {
                            e1.printStackTrace();
                            return false;
                        }

                    }
                }
            }
        }
        return true;
    }
}
