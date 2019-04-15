CREATE SEQUENCE IF NOT EXISTS seq_user;
CREATE SEQUENCE IF NOT EXISTS seq_project;
CREATE SEQUENCE IF NOT EXISTS seq_page;
CREATE SEQUENCE IF NOT EXISTS seq_user_project;

CREATE TABLE IF NOT EXISTS users (
                                   id INTEGER DEFAULT nextval('seq_user') PRIMARY KEY,
                                   email VARCHAR(100) NOT NULL UNIQUE,
                                   username VARCHAR (100) NOT NULL,
                                   password VARCHAR (20) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects(
                                     id INTEGER DEFAULT nextval('seq_project') PRIMARY KEY,
                                     project_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_project(
                                         id INTEGER DEFAULT nextval('seq_project') NOT NULL,
                                         user_id INTEGER NOT NULL,
                                         project_id INTEGER NOT NULL,
                                         FOREIGN KEY(user_id) REFERENCES users(id),
                                         FOREIGN KEY(project_id) REFERENCES projects(id),
                                         PRIMARY KEY(user_id,project_id)
);

CREATE TABLE IF NOT EXISTS pages(
                                  id INTEGER DEFAULT nextval('seq_page') PRIMARY KEY,
                                  page_name VARCHAR(100) NOT NULL UNIQUE,
                                  page_order INTEGER NOT NULL,
                                  page_data json NOT NULL,
                                  project_id INTEGER,
                                  FOREIGN KEY(project_id) REFERENCES projects(id)

);



INSERT INTO users(id,username,email,password) VALUES (1,'tuser1','temail1','tpassword1');
INSERT INTO users(id,username,email,password) VALUES (2,'tuser2','temail2','tpassword2');
INSERT INTO users(id,username,email,password) VALUES (3,'tuser3','temail3','tpassword3');
INSERT INTO users(id,username,email,password) VALUES (4,'tuser4','temail4','tpassword4');

INSERT INTO projects(id,project_name) VALUES (1,'testproject');

INSERT INTO pages(id, page_name, page_order, page_data, project_id)
  VALUES (1,'testpage',1,'{ "customer": "John Doe", "items": {"product": "Beer","qty": 6}}',1);

INSERT INTO user_project (id, user_id, project_id)
  VALUES (1,1,1);
ALTER SEQUENCE seq_user RESTART WITH 5;