package ase.socketConnection;

import ase.message.socket.SocketMessage;

import java.util.concurrent.LinkedBlockingQueue;

public class UserHandler {

    private String userId;
    private String projectId;
    private String pageId;
    private LinkedBlockingQueue<SocketMessage> responderQueue;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getPageId() {
        return pageId;
    }

    public void setPageId(String pageId) {
        this.pageId = pageId;
    }

    public LinkedBlockingQueue<SocketMessage> getResponderQueue() {
        return responderQueue;
    }

    public void setResponderQueue(LinkedBlockingQueue<SocketMessage> responderQueue) {
        this.responderQueue = responderQueue;
    }
}
