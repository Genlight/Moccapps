package ase.service;

import ase.DTO.Invitation;
import ase.DTO.User;
import ase.message.request.Invitation.InvitationForm;

import java.util.List;

public interface InvitationService {

    boolean create (InvitationForm invitationForm);

    boolean delete (Invitation invitation);

    boolean acceptInvitation(Invitation invitation);

    boolean declineInvitation(Invitation invitation);

    List<Invitation> getAllInvitationsForInvitedUser(User user);

    Invitation getInvitationById(int id);
}
