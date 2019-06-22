package ase.socketConnection;

import ase.message.socket.SocketMessage;
import ase.service.CommentService;
import ase.service.PageService;
import ase.service.ProjectVersionService;
import ase.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.micrometer.core.instrument.util.IOUtils;
import org.bouncycastle.util.encoders.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

import java.util.zip.*;

@Controller
public class SocketServer {
    //Current Users mapped to Id
    private Map<String,UserHandler> currentUser;
    //SessionID, UserId
    private Map<String, String> sessionIdUserIdMap;
    //PageID, pageHandler of current active pages
    private Map<String, PageHandler> pageHandlerMap;

    private ExecutorService executorService;
    private SocketConnectionHandler connectionHandler;

    private static final Logger logger= LoggerFactory.getLogger(SocketServer.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private PageService pageService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectVersionService projectVersionService;

    public SocketServer(){
        executorService= Executors.newCachedThreadPool();
        sessionIdUserIdMap =Collections.synchronizedMap(new HashMap<>());
        pageHandlerMap =new HashMap<>();

        currentUser=new HashMap<>();
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent sessionSubscribeEvent){
        String destination=(String) sessionSubscribeEvent.getMessage().getHeaders().get("simpDestination");
        String sessionId=(String) sessionSubscribeEvent.getMessage().getHeaders().get("simpSessionId");

        if(!destination.matches("/user/.*/queue/send")){
            return;
        }

        LinkedBlockingQueue<SocketMessage> queue=new LinkedBlockingQueue<>();
        String userId=destination.split("/")[2];

        UserHandler userHandler=new UserHandler();
        userHandler.setResponderQueue(queue);
        userHandler.setUserId(userId);
        currentUser.put(userId,userHandler);

        sessionIdUserIdMap.put(sessionId,userId);

        connectionHandler=new SocketConnectionHandler(queue,userId,messagingTemplate);
        executorService.submit(connectionHandler);
    }

    @EventListener
    public void onDisconnectEvent(SessionDisconnectEvent sessionDisconnectEvent){
        String sessionId=(String) sessionDisconnectEvent.getMessage().getHeaders().get("simpSessionId");
        String userId= sessionIdUserIdMap.get(sessionId);
        String pageId=currentUser.get(userId).getPageId();
        sessionIdUserIdMap.remove(sessionId);
        pageHandlerMap.get(pageId).unlockElement(userId);
        if(!pageHandlerMap.get(pageId).removeUser(userId)){
            pageHandlerMap.remove(pageId);
        }
        try {
            currentUser.get(userId).getResponderQueue().put(new SocketMessage("","",userId,"disconnect",""));
        } catch (InterruptedException e) {
            logger.error("Client Socket Connection Handler Thread is already closed");
        }

        currentUser.remove(userId);
    }

    @MessageMapping("/send")
    public void onReceive(String compressedMessage) throws IOException {
        byte[] output2 = Base64.decode(compressedMessage);
        InputStream in =
                new InflaterInputStream(new ByteArrayInputStream(output2));
        String result = IOUtils.toString(in);
        in.close();

        final ObjectMapper mapper = new ObjectMapper();
        final SocketMessage message = mapper.readValue(result, SocketMessage.class);


        if(!pageHandlerMap.keySet().contains(message.getPageId())){
            String pageIdString = message.getPageId();
            int pageId = Integer.parseInt(pageIdString);

            PageHandler pageHandler = new PageHandler(message.getProjectId(), pageId, pageService,commentService,userService);
            pageHandlerMap.put(pageIdString, pageHandler);
            UserHandler handler = currentUser.get(message.getUser());

            handler.setProjectId(message.getProjectId());
            handler.setPageId(message.getPageId());
        }
        pageHandlerMap.get(message.getPageId()).addUser(message.getUser());
        UserHandler user= currentUser.get(message.getUser());
        switch (message.getCommand()){
            case "page:load":
                try {
                    user.getResponderQueue().put(new SocketMessage(
                            message.getProjectId(),
                            message.getPageId(),
                            "server",
                            "page:load",
                            pageHandlerMap.get(message.getPageId()).getPageData()));
                } catch (InterruptedException e) {
                    logger.error("Can not communicate with Client Socket Connection Handler Thread during Pageload");
                }
                return;
            case "page:created":
                break;
            case "page:removed":
                String pageId=message.getPageId();
                pageHandlerMap.remove(pageId);
                return;
            case "version:created":
                for(PageHandler page : pageHandlerMap.values()){
                    page.persistPage();
                }
                ObjectNode node = mapper.readValue(message.getContent(), ObjectNode.class);
                projectVersionService.createProjectVersion(Integer.parseInt(message.getProjectId()),node.get("VersionName").asText());
                break;
            default:
                if (!pageHandlerMap.get(message.getPageId()).handleMessage(message)){
                    return;
                }
                break;
        }


        if(message.getCommand().startsWith("page")){
            for(PageHandler pageHandler:pageHandlerMap.values()){
                if(pageHandler.getProjectId().equals(message.getProjectId())){
                    sendMessages(pageHandler.getUser(),message);
                }
            }
            return;
        }
        sendMessages(pageHandlerMap.get(message.getPageId()).getUser(),message);
    }

    private void sendMessages(List<String> user, SocketMessage message){
        for(String userId:user){
            try {
                currentUser.get(userId).getResponderQueue().put(message);
            } catch (InterruptedException e) {
                logger.error("Can not communicate with Client Socket Connection Handler Thread");
            }
        }
    }

}
