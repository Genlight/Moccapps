package ase.tests;

import ase.DTO.*;

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
    private static final String PAGE_3_NAME="page3";

    private static final int PAGE_1_HEIGHT = 100;
    private static final int PAGE_2_HEIGHT = 200;
    private static final int PAGE_3_HEIGHT = 300;

    private static final int PAGE_1_WIDTH = 100;
    private static final int PAGE_2_WIDTH = 200;
    private static final int PAGE_3_WIDTH = 300;

    private static final int PAGE_1_ORDER=1;
    private static final int PAGE_2_ORDER=2;
    private static final int PAGE_3_ORDER=3;

    private static final String PAGE_1_PAGE_DATA
            ="{ \"customer\": \"John Doe\", \"items\": {\"product\": \"Beer\",\"qty\": 6}}";
    private static final String PAGE_2_PAGE_DATA
            ="{ \"customer\": \"James\", \"items\": {\"product\": \"notBeer\",\"qty\": 3}}";
    private static final String PAGE_3_PAGE_DATA
            ="{ \"customer\": \"James\", \"items\": {\"product\": \"notBeer\",\"qty\": 1}}";

    private static final int PAGE_1_PROJECT_ID=1;
    private static final int PAGE_2_PROJECT_ID=1;
    private static final int PAGE_3_PROJECT_ID=2;

    private static final String PROJECTVERSION_1_TAG="testTag1";
    private static final String PROJECTVERSION_2_TAG="testTag2";

    public User createdUser1;
    public User createdUser2;
    public User user3;
    public User user4;

    public Project createdProject1;
    public Project createdProject2;
    public Project project3;
    public Project project4;

    public ProjectVersion projectVersion2;
    public ProjectVersion createdProjectVersion1;

    public PageVersion createdPageVersion1;
    public PageVersion pageVersion2;

    public Page createdPage1;
    public Page createdPage2;
    public Page page3;


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

        createdPage1=new Page(1,PAGE_1_NAME,PAGE_1_HEIGHT,PAGE_1_WIDTH,PAGE_1_ORDER,PAGE_1_PROJECT_ID,PAGE_1_PAGE_DATA);
        createdPage2=new Page(2,PAGE_2_NAME,PAGE_2_HEIGHT,PAGE_2_WIDTH,PAGE_2_ORDER,PAGE_2_PROJECT_ID,PAGE_2_PAGE_DATA);
        page3=new Page(PAGE_3_NAME,PAGE_3_HEIGHT,PAGE_3_WIDTH,PAGE_3_ORDER,PAGE_3_PROJECT_ID,PAGE_3_PAGE_DATA);

        createdInvitation1 = new Invitation(1,1,1,2,-1);
        invitation2 = new Invitation(2,2,1,-1);

        projectVersion2 = new ProjectVersion(PROJECTVERSION_2_TAG,createdProject2.getId());
        createdProjectVersion1 = new ProjectVersion(1,PROJECTVERSION_1_TAG,createdProject1.getId());

        createdPageVersion1 = new PageVersion(1,createdPage1.getPage_name(),createdPage1.getHeight(),createdPage1.getWidth(),createdPage1.getPage_order(),createdProjectVersion1.getId(),createdPage1.getPage_data());
        pageVersion2 = new PageVersion(createdPage2.getPage_name(),createdPage2.getHeight(),createdPage2.getWidth(),createdPage2.getPage_order(),createdProjectVersion1.getId(),createdPage2.getPage_data());

    }
}
