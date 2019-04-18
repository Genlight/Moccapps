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

ALTER SEQUENCE seq_user RESTART WITH 3;
ALTER SEQUENCE seq_project RESTART WITH 3;
ALTER SEQUENCE seq_page RESTART WITH 2;
ALTER SEQUENCE seq_user_project RESTART WITH 4;