package ase.service;

import ase.DTO.Invitation;
import ase.DTO.User;
import ase.message.request.InvitationForm;

import java.util.List;

public interface InvitationService {

    Invitation create (InvitationForm invitation);

    boolean delete (Invitation invitation);

    boolean acceptInvitation(Invitation invitation);

    boolean declineInvitation(Invitation invitation);

    List<Invitation> getAllInvitationsForInvitedUser(User user);


}
