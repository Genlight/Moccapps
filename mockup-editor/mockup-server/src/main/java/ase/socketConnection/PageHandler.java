package ase.socketConnection;

import ase.DTO.Page;
import ase.DTO.User;
import ase.message.socket.SocketMessage;
import ase.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

public class PageHandler {

    private List<String> currentUser;
    private Page page;
    private PageService pageService;


    public PageHandler(int pageId, PageService pageService){
        currentUser=new ArrayList<>();
        this.pageService = pageService;
        page=pageService.getPageById(pageId);
    }

    public boolean handleMessage(SocketMessage message){
        switch (message.getCommand()){
            case"version":
                break;
            case "edit":
                break;
        }
        return true;
    }

    public void addUser(String user){
        if(!currentUser.contains(user)){
            currentUser.add(user);
        }
    }

    /**
     * @param user user to be removed from the page
     * @return true - page does not close, false - pageHandler persist and can be dropped
     */
    public boolean removeUser(String user){
        currentUser.remove(user);
        if(currentUser.isEmpty()){
            shutdown();
            return false;
        }
        return true;
    }

    public List<String> getUser(){
        return currentUser;
    }

    private void shutdown(){
        pageService.update(page);
    }

}
