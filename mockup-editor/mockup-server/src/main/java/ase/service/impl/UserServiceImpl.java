package ase.service.impl;

import ase.DAO.DAOException;
import ase.DAO.UserDAO;
import ase.DTO.User;
import ase.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userDAO;

    private static final Logger logger= LoggerFactory.getLogger(UserServiceImpl.class);
    private List<String> loggedInUserEmails=new ArrayList<>();

    @Override
    public boolean login(String email, String password) {
        try {
            User user=userDAO.findByEmail(email);
            if(user==null){
                return false;
            }
            if (user.getPassword().equals(password)){
                loggedInUserEmails.add(user.getEmail());
                return true;
            }
            return false;
        }catch (DAOException e){
            logger.error("UserService: can not read from Database");
        }
        return false;
    }

    @Override
    public boolean logout(String email) {
        if(loggedInUserEmails.contains(email)){
            loggedInUserEmails.remove(email);
            return true;
        }
        return false;
    }

    @Override
    public boolean isLoggedIn(String email) {
        if(loggedInUserEmails.contains(email)){
            return true;
        }
        return false;
    }
    @Override
    public boolean register(User user) {
        try{
            userDAO.create(user);
            return true;
        }catch(DAOException e){
            logger.error("UserService: can not create User");
        }
        return false;
    }
}
