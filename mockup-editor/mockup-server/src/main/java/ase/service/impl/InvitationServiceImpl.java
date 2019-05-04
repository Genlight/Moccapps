package ase.service.impl;

import ase.DTO.Invitation;
import ase.DTO.User;
import ase.message.request.InvitationForm;
import ase.service.InvitationService;

import java.util.List;

public class InvitationServiceImpl implements InvitationService {
    @Override
    public Invitation create(InvitationForm invitation) {
        return null;
    }

    @Override
    public boolean delete(Invitation invitation) {
        return false;
    }

    @Override
    public boolean acceptInvitation(Invitation invitation) {
        return false;
    }

    @Override
    public boolean declineInvitation(Invitation invitation) {
        return false;
    }

    @Override
    public List<Invitation> getAllInvitationsForInvitedUser(User user) {
        return null;
    }
}
