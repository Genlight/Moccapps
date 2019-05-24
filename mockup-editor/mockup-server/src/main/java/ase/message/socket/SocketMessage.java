package ase.message.socket;

public class SocketMessage {

    private String projectId;
    private String pageId;
    private String user;
    private String command;
    private String content;

    public SocketMessage(){

    }

    public SocketMessage(String projectId, String pageId, String user, String command, String content) {
        this.projectId = projectId;
        this.pageId = pageId;
        this.user=user;
        this.command = command;
        this.content = content;
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

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
