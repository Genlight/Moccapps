package ase.socketConnection;

import ase.message.socket.SocketMessage;
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

    private Map<String, LinkedBlockingQueue<SocketMessage>> messageQueues;

    private ExecutorService executorService;
    private SocketConnectionHandler connectionHandler;

    private static final Logger logger= LoggerFactory.getLogger(SocketServer.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public SocketServer(){
        messageQueues=Collections.synchronizedMap(new HashMap<>());
        executorService= Executors.newCachedThreadPool();
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent sessionSubscribeEvent){
        String destination=(String) sessionSubscribeEvent.getMessage().getHeaders().get("simpDestination");
        if(!destination.matches("/user/.*/queue/send")){
            return;
        }
        LinkedBlockingQueue<SocketMessage> queue=new LinkedBlockingQueue<>();
        destination=destination.split("/")[2];
        connectionHandler=new SocketConnectionHandler(queue,destination,messagingTemplate);
        messageQueues.put(destination,queue);
        executorService.submit(connectionHandler);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent sessionDisconnectEvent){
        logger.info("disconnected");
    }

    @MessageMapping("/send")
    public void onReceive(@Payload SocketMessage message) throws IOException {
        for(String clientname:messageQueues.keySet()){
            if(!message.getUser().equals(clientname)){
                try {
                    messageQueues.get(clientname).put(message);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }

    }
}
