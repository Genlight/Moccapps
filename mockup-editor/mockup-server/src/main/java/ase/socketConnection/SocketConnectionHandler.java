package ase.socketConnection;

import ase.message.socket.SocketMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.concurrent.LinkedBlockingQueue;

public class SocketConnectionHandler implements Runnable{

    private LinkedBlockingQueue<SocketMessage> messages;
    private String user;
    private SimpMessagingTemplate messagingTemplate;

    private static final Logger logger= LoggerFactory.getLogger(SocketConnectionHandler.class);


    public SocketConnectionHandler(LinkedBlockingQueue<SocketMessage> messages,String user,SimpMessagingTemplate simpMessagingTemplate){
        this.messages=messages;
        this.user=user;
        this.messagingTemplate=simpMessagingTemplate;
        logger.info(user);
    }

    @Override
    public void run() {
        SocketMessage currentMessage;
        while(true){
            try {
                currentMessage=messages.take();
                if(currentMessage.getCommand().equals("disconnect")){
                    break;
                }
                messagingTemplate.convertAndSendToUser(user,"/queue/send",currentMessage);
            } catch (InterruptedException e) {
                logger.error("Caught Error while communcating with SocketServer");
                logger.error("closing thread...");
            }
        }
    }
}
