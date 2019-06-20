package ase.socketConnection;

import ase.DTO.Page;
import ase.message.socket.SocketMessage;
import ase.service.PageService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.*;


public class PageHandler {

    private List<String> currentUser;
    private Page page;
    private PageService pageService;
    private ObjectMapper objectMapper;
    private String projectId;
    private Map<String,String> lockedElements;

    private static final Logger logger= LoggerFactory.getLogger(PageHandler.class);

    public PageHandler(String projectId,int pageId, PageService pageService){
        currentUser=new ArrayList<>();
        objectMapper=new ObjectMapper();
        this.pageService = pageService;
        page=pageService.getPageById(pageId);
        this.projectId=projectId;
        lockedElements=new HashMap<>();
    }

    public boolean handleMessage(SocketMessage message){
        JsonNode pageData;
        logger.debug("Command: " + message.getCommand());
        logger.debug("Content: " + message.getContent());
        try {
            pageData = objectMapper.readTree(page.getPage_data());
        } catch (IOException e) {
            logger.error("Couldn't process page data");
            return false;
        }
        switch (message.getCommand()){
            case"element:added":
                try {
                    ObjectNode content = objectMapper.readValue(message.getContent(),ObjectNode.class);
                    ((ArrayNode)pageData.get("objects")).add(content);
                    page.setPage_data(pageData.toString());
                } catch (IOException e) {
                    logger.error("couldn't parse content in element:added");
                    return false;
                }
                return true;
            case "element:modified":
                logger.error(page.getPage_data());
                try {
                    ArrayNode objects = ((ArrayNode)pageData.get("objects"));
                    ObjectNode content = objectMapper.readValue(message.getContent(),ObjectNode.class);
                    String objectUuid = content.get("uuid").asText();
                    logger.error("element: " + lockedElements.get(message.getUser()));
                    logger.error("uuid   : " + objectUuid);
                    if(lockedElements.get(message.getUser())!=null && !lockedElements.get(message.getUser()).equals(objectUuid)){
                        return false;
                    }
                    for(int i = 0; i < objects.size(); i++){
                        JsonNode singlePageObject = objects.get(i);
                        if(!objectUuid.equals(singlePageObject.get("uuid").asText())){
                            continue;
                        }
                        Iterator contentIt=content.fieldNames();
                        ObjectNode singlePageObjectON=singlePageObject.deepCopy();
                        while( contentIt.hasNext()){
                            String fieldName =(String) contentIt.next();
                            singlePageObjectON.put(fieldName,content.get(fieldName));
                        }
                        objects.remove(i);
                        objects.insert(i,singlePageObjectON);
                        ((ObjectNode)pageData).put("objects",objects);
                        break;
                    }
                    page.setPage_data(pageData.toString());
                } catch (IOException e) {
                    logger.error("couldn't parse content in element:modified");
                    return false;
                }
                return true;
            case "element:removed":
                try{
                    ArrayNode objects = ((ArrayNode)pageData.get("objects"));
                    String objectUuid = objectMapper.readValue(message.getContent(),ObjectNode.class).get("uuid").asText();
                    if(lockedElements.get(message.getUser())!=null && !lockedElements.get(message.getUser()).equals(objectUuid)){
                        return false;
                    }
                    for(int i = 0; i < objects.size(); i++) {
                        JsonNode singlePageObject = objects.get(i);
                        if (!objectUuid.equals(singlePageObject.get("uuid").asText())) {
                            continue;
                        }
                        objects.remove(i);
                        break;
                    }
                    ((ObjectNode)pageData).put("objects",objects);
                    return true;
                }catch (IOException e){
                    logger.error("couldn't parse content in element:removed");
                    return false;
                }
            case "element:locked":
                try {
                    ObjectNode node = objectMapper.readValue(message.getContent(), ObjectNode.class);
                    lockedElements.put(message.getUser(),node.get("uuid").asText());
                }catch (IOException e){
                    logger.error("couldn't parse content in element:locked");
                    return false;
                }
                return true;
            case "element:unlocked":
                unlockElement(message.getUser());
                return true;
            case "page:modified":{
                try {
                    ObjectNode content = objectMapper.readValue(message.getContent(),ObjectNode.class);
                    Iterator contentIt=content.fieldNames();

                    ObjectNode pageDataOn=pageData.deepCopy();
                    while( contentIt.hasNext()){
                        String fieldName =(String) contentIt.next();
                        if(fieldName.equals("objects")){
                            continue;
                        }
                        String value = content.get(fieldName).asText();
                        pageDataOn.put(fieldName,content.get(fieldName).asText());
                    }
                    page.setPage_data(pageDataOn.toString());
                } catch (IOException e) {
                    logger.error("couldn't parse content in page:modified");
                    return false;
                }
                return true;
            }
            case "page:dimensionchange":{
                try {
                    ObjectNode content = objectMapper.readValue(message.getContent(),ObjectNode.class);
                    page.setHeight(content.get("changeheight").asInt());
                    page.setWidth(content.get("changewidth").asInt());
                    persistPage();
                    return true;
                } catch (IOException e) {
                    logger.error("couldn't parse content in page:dimensionchange");
                    return false;
                }
            }
            case "page:renamed":{
                try {
                    ObjectNode content = objectMapper.readValue(message.getContent(),ObjectNode.class);
                    page.setPage_name(content.get("pageName").asText());
                    return true;
                } catch (IOException e) {
                    logger.error("couldn't parse content in page:renamed");
                    return false;
                }
            }
            case "comment:added":
                break;
            case "comment:modified":
                break;
            case "comment:cleared":
                break;
            case "commententry:added":
                break;
            case "commententry:deleted":
                break;
            case "commententry:modified":
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
        logger.debug(user + " removed");
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

    public String getPageData(){
        return page.getPage_data();
    }

    public void persistPage(){
        pageService.update(page);
        logger.debug("page: " + page.getId() + " persisted");
    }

    private void shutdown(){
        persistPage();
    }

    public String getProjectId() {
        return projectId;
    }

    public void unlockElement(String user){
        lockedElements.remove(user);
    }

}
