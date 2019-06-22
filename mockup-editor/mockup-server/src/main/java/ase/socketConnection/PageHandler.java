package ase.socketConnection;

import ase.DTO.Comment;
import ase.DTO.CommentEntry;
import ase.DTO.Page;
import ase.message.socket.SocketMessage;
import ase.service.CommentService;
import ase.service.PageService;
import ase.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.lang.reflect.Array;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


public class PageHandler {

    private List<String> currentUser;
    private Page page;
    private PageService pageService;
    private UserService userService;
    private CommentService commentService;
    private ObjectMapper objectMapper;
    private String projectId;
    private Map<String,String> lockedElements;

    private static final Logger logger= LoggerFactory.getLogger(PageHandler.class);

    public PageHandler(String projectId,int pageId, PageService pageService,CommentService commentService,UserService userService){
        currentUser=new ArrayList<>();
        objectMapper=new ObjectMapper();
        this.pageService = pageService;
        this.commentService = commentService;
        this.userService = userService;
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
                    if(lockedElements.get(objectUuid)!=null && !lockedElements.get(objectUuid).equals(message.getUser())){
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
                    if(lockedElements.get(objectUuid)!=null && !lockedElements.get(objectUuid).equals(message.getUser())){
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
                    page.setPage_data(pageData.toString());
                    return true;
                }catch (IOException e){
                    logger.error("couldn't parse content in element:removed");
                    return false;
                }
            case "element:locked":
                try {
                    ObjectNode node = objectMapper.readValue(message.getContent(), ObjectNode.class);
                    lockedElements.put(node.get("uuid").asText(),message.getUser());
                }catch (IOException e){
                    logger.error("couldn't parse content in element:locked");
                    return false;
                }
                return true;
            case "element:unlocked":
                try {
                    ObjectNode node = objectMapper.readValue(message.getContent(), ObjectNode.class);
                    lockedElements.entrySet().removeIf(e -> e.getKey().equals(node.get("uuid").toString()));
                    return true;
                } catch (IOException e) {
                    logger.error("couldn't parse content in element:unlocked");
                    return false;
                }
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
                try {
                    logger.info("comment:added:content:"+message.getContent());
                    Comment comment = new Comment();
                    ObjectNode content = objectMapper.readValue(message.getContent(), ObjectNode.class);
                    JsonNode commentNode = content.get("comment");
                    comment.setCleared(commentNode.get("isCleared").asBoolean());
                    comment.setUuid(commentNode.get("uuid").asText());
                    ArrayNode entries = ((ArrayNode)commentNode.get("entries"));
                    ArrayList<CommentEntry> commentEntries = new ArrayList<>();
                    for(JsonNode e:entries){
                        CommentEntry commentEntry = new CommentEntry();
                        commentEntry.setMessage(e.get("message").asText());
                        commentEntry.setOrder(e.get("id").asInt());
                        commentEntry.setUser(userService.getUserByEmail(e.get("email").asText()));
                        String stri= e.get("date").asText();
                        if(stri.length()<14){ //date sometimes in epoch ms
                            commentEntry.setDate(Timestamp.from(Instant.ofEpochMilli(Long.parseLong(stri))));
                        }
                        else{
                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                            LocalDateTime dateTime = LocalDateTime.parse(stri, formatter);
                            commentEntry.setDate(Timestamp.valueOf(dateTime));
                        }
                        commentEntries.add(commentEntry);
                    }
                    ArrayNode objects = ((ArrayNode)commentNode.get("objectUuid"));
                    ArrayList<String> objectStrings = new ArrayList<>();
                    for(JsonNode e:objects) {
                        String temp = e.textValue();
                        objectStrings.add(temp);
                    }
                    comment.setCommentEntryList(commentEntries);
                    comment.setCommentObjects(objectStrings);
                    comment.setPage_id(page.getId());
                    commentService.createCommentAndEntry(comment);
                    return true;
                } catch (IOException e) {
                    logger.error("couldn't parse content in comment:added");
                }
            case "comment:modified":
                logger.info("comment:modified:content:"+message.getContent());
                //Command is unnecessary,can't change page or uuid and isCleared has separate cmd
                break;
            case "comment:cleared":
                logger.info("comment:cleared:content:"+message.getContent());
                try {
                    Comment comment = new Comment();
                    ObjectNode content = objectMapper.readValue(message.getContent(), ObjectNode.class);
                    JsonNode commentNode = content.get("comment");
                    String uuid = commentNode.get("uuid").asText();
                    comment = commentService.findCommentByUUID(uuid);
                    comment.setCleared(commentNode.get("isCleared").asBoolean());
                    commentService.updateComment(comment);

                } catch (IOException e) {
                    e.printStackTrace();
                }
                return true;
            case "commententry:added":
                logger.info("commententry:added:content:"+message.getContent());
                try {
                    Comment comment = new Comment();
                    ObjectNode content = objectMapper.readValue(message.getContent(), ObjectNode.class);
                    JsonNode commentNode = content.get("comment");
                    String uuid = commentNode.get("uuid").asText();
                    comment = commentService.findCommentByUUID(uuid);

                    ArrayNode entries = ((ArrayNode)commentNode.get("entries"));
                    ArrayList<CommentEntry> commentEntries = new ArrayList<>();
                    for(JsonNode e:entries){
                        CommentEntry commentEntry = new CommentEntry();
                        commentEntry.setMessage(e.get("message").asText());
                        commentEntry.setOrder(e.get("id").asInt());
                        commentEntry.setUser(userService.getUserByEmail(e.get("email").asText()));
                        String stri= e.get("date").asText();
                        if(stri.length()<14){ //date sometimes in epoch ms
                            commentEntry.setDate(Timestamp.from(Instant.ofEpochMilli(Long.parseLong(stri))));
                        }
                        else{
                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                            LocalDateTime dateTime = LocalDateTime.parse(stri, formatter);
                            commentEntry.setDate(Timestamp.valueOf(dateTime));
                        }

                        commentEntry.setCommentId(comment.getId());
                        boolean exists = false;
                       for(CommentEntry x:comment.getCommentEntryList()){
                           if(x.equals(commentEntry)){
                               exists = true;
                               break;
                           }
                       }
                       if(!exists){
                           commentEntries.add(commentEntry);
                       }
                    }
                    for(CommentEntry x:comment.getCommentEntryList()){
                        logger.info("Current List:"+x);
                    }

                    for(CommentEntry e:commentEntries){
                        logger.info("New List:"+e);
                        commentService.createCommentEntry(e);
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                }
                return true;

            case "commententry:deleted":
                logger.info("commententry:deleted:content:"+message.getContent());
                //gets called from somewhere for no reason and deletes all entries
                try {
                    Comment comment = new Comment();
                    ObjectNode content = objectMapper.readValue(message.getContent(), ObjectNode.class);
                    JsonNode commentNode = content.get("comment");
                    String uuid = commentNode.get("uuid").asText();
                    comment = commentService.findCommentByUUID(uuid);
                    List<CommentEntry> currentCommentEntryList= comment.getCommentEntryList();

                    ArrayNode entries = ((ArrayNode)commentNode.get("entries"));
                    ArrayList<CommentEntry> newCommentEntries = new ArrayList<>();
                    for(JsonNode e:entries){
                        CommentEntry commentEntry = new CommentEntry();
                        commentEntry.setMessage(e.get("message").asText());
                        commentEntry.setOrder(e.get("id").asInt());
                        commentEntry.setUser(userService.getUserByEmail(e.get("email").asText()));
                        String stri= e.get("date").asText();
                        if(stri.length()<14){ //date sometimes in epoch ms
                            commentEntry.setDate(Timestamp.from(Instant.ofEpochMilli(Long.parseLong(stri))));
                        }
                        else{
                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                            LocalDateTime dateTime = LocalDateTime.parse(stri, formatter);
                            commentEntry.setDate(Timestamp.valueOf(dateTime));
                        }
                        commentEntry.setCommentId(comment.getId());
                        newCommentEntries.add(commentEntry);
                    }

                    for(CommentEntry e:currentCommentEntryList){
                        if(!newCommentEntries.contains(e)){
                            logger.info("Removing CommentEntry:"+e);
                            commentService.removeCommentEntry(e);
                            break; //Can be just one per message
                        }
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                }
                return true;
            case "commententry:modified":
                logger.info("commententry:modified:content:"+message.getContent());
                try {
                    Comment comment = new Comment();
                    ObjectNode content = objectMapper.readValue(message.getContent(), ObjectNode.class);
                    JsonNode commentNode = content.get("comment");
                    String uuid = commentNode.get("uuid").asText();
                    comment = commentService.findCommentByUUID(uuid);
                    List<CommentEntry> currentCommentEntryList= comment.getCommentEntryList();

                    ArrayNode entries = ((ArrayNode)commentNode.get("entries"));
                    ArrayList<CommentEntry> newCommentEntries = new ArrayList<>();
                    for(JsonNode e:entries){
                        CommentEntry commentEntry = new CommentEntry();
                        commentEntry.setMessage(e.get("message").asText());
                        commentEntry.setOrder(e.get("id").asInt());
                        commentEntry.setUser(userService.getUserByEmail(e.get("email").asText()));
                        String stri= e.get("date").asText();
                        if(stri.length()<14){ //date sometimes in epoch ms
                            commentEntry.setDate(Timestamp.from(Instant.ofEpochMilli(Long.parseLong(stri))));
                        }
                        else{
                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                            LocalDateTime dateTime = LocalDateTime.parse(stri, formatter);
                            commentEntry.setDate(Timestamp.valueOf(dateTime));
                        }
                        commentEntry.setCommentId(comment.getId());
                        newCommentEntries.add(commentEntry);
                    }

                    for(CommentEntry e:currentCommentEntryList){
                        if(!newCommentEntries.contains(e)){
                            logger.info("updating CommentEntry:"+e);
                            commentService.updateCommentEntry(e);
                            break; //Can be just one per message
                        }
                    }


                } catch (IOException e) {
                    e.printStackTrace();
                }
                return true;
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
        lockedElements.entrySet().removeIf(e -> e.getValue().equals(user));
    }
}