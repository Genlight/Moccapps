package ase.socketConnection;

import ase.DTO.Page;
import ase.message.socket.SocketMessage;
import ase.service.PageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

@Controller
public class SocketServer {
    //UserId , Queue to answer
    private Map<String, LinkedBlockingQueue<SocketMessage>> messageQueues;
    //SessionID, Clientname
    private Map<String, String> sessionIdUserIdMap;
    //PageID, pageHandler of current active pages
    private Map<String, PageHandler> pageHandlerMap;
    //UserID,PageID
    private Map<String,String> userPageMap;
    private ExecutorService executorService;
    private SocketConnectionHandler connectionHandler;

    private static final Logger logger= LoggerFactory.getLogger(SocketServer.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private PageService pageService;

    public SocketServer(){
        messageQueues=Collections.synchronizedMap(new HashMap<>());
        executorService= Executors.newCachedThreadPool();
        sessionIdUserIdMap =Collections.synchronizedMap(new HashMap<>());
        pageHandlerMap =new HashMap<>();
        userPageMap=new HashMap<>();
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent sessionSubscribeEvent){
        logger.info(sessionSubscribeEvent.getMessage().toString());
        String destination=(String) sessionSubscribeEvent.getMessage().getHeaders().get("simpDestination");
        String sessionId=(String) sessionSubscribeEvent.getMessage().getHeaders().get("simpSessionId");
        if(!destination.matches("/user/.*/queue/send")){
            return;
        }
        LinkedBlockingQueue<SocketMessage> queue=new LinkedBlockingQueue<>();
        destination=destination.split("/")[2];
        connectionHandler=new SocketConnectionHandler(queue,destination,messagingTemplate);
        messageQueues.put(destination,queue);
        sessionIdUserIdMap.put(sessionId,destination);
        executorService.submit(connectionHandler);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent sessionDisconnectEvent){
        String sessionId=(String) sessionDisconnectEvent.getMessage().getHeaders().get("simpSessionId");
        String userId= sessionIdUserIdMap.get(sessionId);
        sessionIdUserIdMap.remove(sessionId);
        if(!pageHandlerMap.get(userPageMap.get(userId)).removeUser(userId)){
            pageHandlerMap.remove(userPageMap.get(userId));
        }
        userPageMap.remove(userId);
        try {
            messageQueues.get(userId).put(new SocketMessage("","",userId,"disconnect",""));
            messageQueues.remove(userId);
        } catch (InterruptedException e) {
            logger.error("Client Socket Connection Handler Thread is already closed");
        }
    }

    @MessageMapping("/send")
    public void onReceive(@Payload SocketMessage message) throws IOException {
        logger.info("MESSAGE: " + message.toString());
        if(!pageHandlerMap.keySet().contains(message.getPageId())){
            String pageIdString = message.getPageId();
            int pageId = Integer.parseInt(pageIdString);
            PageHandler pageHandler = new PageHandler(pageId, pageService);
            pageHandlerMap.put(pageIdString, pageHandler);
            userPageMap.put(message.getUser(),message.getPageId());
        }
        pageHandlerMap.get(message.getPageId()).addUser(message.getUser());
        pageHandlerMap.get(message.getPageId()).handleMessage(message);

        for(String userId:pageHandlerMap.get(message.getPageId()).getUser()){
            try {
                messageQueues.get(userId).put(message);
            } catch (InterruptedException e) {
                logger.error("Can not communicate with Client Socket Connection Handler Thread");
            }
        }

    }
}
