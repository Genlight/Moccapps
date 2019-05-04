INSERT INTO users(id,username,email,password) VALUES
    (1,'user1','email1','password1'),
    (2,'user2','email2','password2');

INSERT INTO projects(id,project_name) VALUES
    (1,'project1'),
    (2,'project2');

INSERT INTO user_project (id, user_id, project_id) VALUES
    (1,1,1),
    (2,2,1),
    (3,2,2);

INSERT INTO pages(id,page_name, page_order, page_data, project_id)
VALUES (1,'page1',1,'{ "customer": "John Doe", "items": {"product": "Beer","qty": 6}}',1);

INSERT INTO invitations(id,project_id,inviter_user_id,invitee_user_id,status) VALUES ( 1,1,1,2,-1);


ALTER SEQUENCE seq_user RESTART WITH 3;
ALTER SEQUENCE seq_project RESTART WITH 3;
ALTER SEQUENCE seq_page RESTART WITH 2;
ALTER SEQUENCE seq_user_project RESTART WITH 4;
ALTER SEQUENCE seq_invitation RESTART WITH 4;