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
                                         id INTEGER DEFAULT nextval('seq_project'),
                                         user_id INTEGER NOT NULL,
                                         project_id INTEGER NOT NULL,
                                         FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                                         FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
                                         PRIMARY KEY(user_id,project_id)
);

CREATE TABLE IF NOT EXISTS pages(
                                  id INTEGER DEFAULT nextval('seq_page') PRIMARY KEY,
                                  page_name VARCHAR(100) NOT NULL,
                                  page_order INTEGER NOT NULL,
                                  page_data json NOT NULL,
                                  project_id INTEGER NOT NULL,
                                  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE

);

