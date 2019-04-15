CREATE SEQUENCE IF NOT EXISTS seq_user;

CREATE TABLE IF NOT EXISTS users (
                                   id INTEGER DEFAULT nextval('seq_user') PRIMARY KEY,
                                   email VARCHAR(100) NOT NULL UNIQUE,
                                   username VARCHAR (100) NOT NULL,
                                   password VARCHAR (20) NOT NULL
);


INSERT INTO users(id,username,email,password) VALUES (1,'tuser1','temail1','tpassword1');
INSERT INTO users(id,username,email,password) VALUES (2,'tuser2','temail2','tpassword2');
INSERT INTO users(id,username,email,password) VALUES (3,'tuser3','temail3','tpassword3');
INSERT INTO users(id,username,email,password) VALUES (4,'tuser4','temail4','tpassword4');
ALTER SEQUENCE seq_user RESTART WITH 5;