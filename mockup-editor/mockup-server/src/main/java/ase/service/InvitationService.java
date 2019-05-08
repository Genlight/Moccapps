package ase.service;

import ase.DTO.Invitation;
import ase.DTO.Project;
import ase.DTO.User;
import ase.message.request.Invitation.InvitationForm;

import java.util.List;

public interface InvitationService {

    boolean create(InvitationForm invitationForm, String username);

    boolean delete (Invitation invitation);

    boolean acceptInvitation(Invitation invitation);

    boolean declineInvitation(Invitation invitation);

    List<Invitation> getAllInvitationsForInvitedUser(User user);

    List<Invitation> getAllInvitationsForProject(Project project);

    Invitation getInvitationById(int id);

    boolean update(InvitationForm invitationForm, String username);
}
