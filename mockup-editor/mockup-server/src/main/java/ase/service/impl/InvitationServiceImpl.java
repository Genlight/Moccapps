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

    @Override
    public boolean create(InvitationForm invitationForm, String username) {
        User inviter = userService.getUserByEmail(username);

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
            //Add user to project's users field
            Invitation invite = invitationDAO.findById(invitation.getId());
            Project project = this.projectService.getProjectById(invite.getProject_id());
            project.addUser(invite.getInvitee_user_id());

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

    @Override
    public Invitation getInvitationById(int id) {
        try {
            return invitationDAO.findById(id);
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return null;
    }

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
                try {
                    invitationDAO.create(invitation);
                    return true;
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
                        try {
                            invitationDAO.delete(f);
                            return true;
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
