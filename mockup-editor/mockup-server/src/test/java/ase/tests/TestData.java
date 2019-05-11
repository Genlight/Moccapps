package ase.tests;

import ase.DTO.Invitation;
import ase.DTO.Page;
import ase.DTO.Project;
import ase.DTO.User;

public class TestData {

    private static final String USER_1_EMAIL="email1";
    private static final String USER_2_EMAIL="email2";
    private static final String USER_3_EMAIL="email3";
    private static final String USER_4_EMAIL="email4";

    private static final String USER_1_USERNAME="user1";
    private static final String USER_2_USERNAME="user2";
    private static final String USER_3_USERNAME="user3";
    private static final String USER_4_USERNAME="user4";

    private static final String USER_1_PASSWORD="password1";
    private static final String USER_2_PASSWORD="password2";
    private static final String USER_3_PASSWORD="password3";
    private static final String USER_4_PASSWORD="password4";

    private static final String PROJECT_1_NAME="project1";
    private static final String PROJECT_2_NAME="project2";
    private static final String PROJECT_3_NAME="project3";
    private static final String PROJECT_4_NAME="project4";

    private static final String PAGE_1_NAME="page1";
    private static final String PAGE_2_NAME="page2";


    private static final int PAGE_1_ORDER=1;
    private static final int PAGE_2_ORDER=2;

    private static final String PAGE_1_PAGE_DATA
            ="{ \"customer\": \"John Doe\", \"items\": {\"product\": \"Beer\",\"qty\": 6}}";
    private static final String PAGE_2_PAGE_DATA
            ="{ \"customer\": \"James\", \"items\": {\"product\": \"notBeer\",\"qty\": 3}}";

    private static final int PAGE_1_PROJECT_ID=1;
    private static final int PAGE_2_PROJECT_ID=2;

    public User createdUser1;
    public User createdUser2;
    public User user3;
    public User user4;

    public Project createdProject1;
    public Project createdProject2;
    public Project project3;
    public Project project4;

    public Page createdPage1;
    public Page page2;


    public Invitation createdInvitation1;
    public Invitation invitation2;

    public void init(){
        createdUser1=new User(1,USER_1_USERNAME,USER_1_EMAIL,USER_1_PASSWORD);
        createdUser2=new User(2,USER_2_USERNAME,USER_2_EMAIL,USER_2_PASSWORD);
        user3=new User(USER_3_USERNAME,USER_3_EMAIL,USER_3_PASSWORD);
        user4=new User(USER_4_USERNAME,USER_4_EMAIL,USER_4_PASSWORD);

        createdProject1=new Project(1,PROJECT_1_NAME);
        createdProject2=new Project(2,PROJECT_2_NAME);
        project3=new Project(PROJECT_3_NAME);
        project4=new Project(PROJECT_4_NAME);

        createdProject1.addUser(1);
        createdProject1.addUser(2);

        createdProject2.addUser(2);

        project3.addUser(1);
        project3.addUser(2);
        project4.addUser(2);

        createdPage1=new Page(1,PAGE_1_NAME,PAGE_1_ORDER,PAGE_1_PROJECT_ID,PAGE_1_PAGE_DATA);
        page2=new Page(PAGE_2_NAME,PAGE_2_ORDER,PAGE_2_PROJECT_ID,PAGE_2_PAGE_DATA);

        createdInvitation1 = new Invitation(1,1,1,2,-1);
        invitation2 = new Invitation(2,2,1,-1);

    }
}
