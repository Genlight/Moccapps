package ase.tests;

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

    private static final String USER_1_PASSWORD="pw1";
    private static final String USER_2_PASSWORD="pw2";
    private static final String USER_3_PASSWORD="pw3";
    private static final String USER_4_PASSWORD="pw4";

    public User user1;
    public User user2;
    public User user3;
    public User user4;

    public void init(){
        user1=new User(USER_1_USERNAME,USER_1_EMAIL,USER_1_PASSWORD);
        user2=new User(USER_2_USERNAME,USER_2_EMAIL,USER_2_PASSWORD);
        user3=new User(USER_3_USERNAME,USER_3_EMAIL,USER_3_PASSWORD);
        user4=new User(USER_4_USERNAME,USER_4_EMAIL,USER_4_PASSWORD);
    }
}
