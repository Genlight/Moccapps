package ase.tests;

import ase.DTO.Page;
import ase.DTO.User;

class TestData {

    private static final String USER_1_EMAIL="email1";
    private static final String USER_2_EMAIL="email2";
    private static final String USER_3_EMAIL="email3";
    private static final String USER_4_EMAIL="email4";

    private static final String USER_1_USERNAME="user1";
    private static final String USER_2_USERNAME="user2";
    private static final String USER_3_USERNAME="user3";
    private static final String USER_4_USERNAME="user4";

    private static final String USER_1_PASSWORD="pw1";
    private static final String USER_2_PASSWORD="pw2";
    private static final String USER_3_PASSWORD="pw3";
    private static final String USER_4_PASSWORD="pw4";

    private static final String PAGE_1_NAME="testpage";
    private static final int PAGE_1_ORDER=1;
    private static final String PAGE_1_PAGE_DATA
            ="{ \"customer\": \"John Doe\", \"items\": {\"product\": \"Beer\",\"qty\": 6}}";
    private static final int PAGE_1_PROJECT_ID=1;


    User user1;
    private User user2;
    private User user3;
    private User user4;

    Page page1;

    void init(){
        user1=new User(USER_1_USERNAME,USER_1_EMAIL,USER_1_PASSWORD);
        user2=new User(USER_2_USERNAME,USER_2_EMAIL,USER_2_PASSWORD);
        user3=new User(USER_3_USERNAME,USER_3_EMAIL,USER_3_PASSWORD);
        user4=new User(USER_4_USERNAME,USER_4_EMAIL,USER_4_PASSWORD);

        page1=new Page(PAGE_1_NAME,PAGE_1_ORDER,PAGE_1_PROJECT_ID,PAGE_1_PAGE_DATA);
    }
}
