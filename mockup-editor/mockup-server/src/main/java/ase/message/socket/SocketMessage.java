package ase.message.socket;

public class SocketMessage {

    private String user;
    private String command;
    private String content;

    public SocketMessage(){

    }

    public SocketMessage(String user, String command, String content) {
        this.user = user;
        this.command = command;
        this.content = content;
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
