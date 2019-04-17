INSERT INTO users(id,username,email,password) VALUES (1,'tuser1','temail1','tpassword1');
INSERT INTO users(id,username,email,password) VALUES (2,'tuser2','temail2','tpassword2');
INSERT INTO users(id,username,email,password) VALUES (3,'tuser3','temail3','tpassword3');
INSERT INTO users(id,username,email,password) VALUES (4,'tuser4','temail4','tpassword4');

INSERT INTO projects(id,project_name) VALUES (1,'testproject');

INSERT INTO pages(page_name, page_order, page_data, project_id)
  VALUES ('testpage',1,'{ "customer": "John Doe", "items": {"product": "Beer","qty": 6}}',1);

INSERT INTO user_project (user_id, project_id)
  VALUES (1,1);


ALTER SEQUENCE seq_user RESTART WITH 5;