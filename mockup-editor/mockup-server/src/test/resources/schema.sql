CREATE SEQUENCE IF NOT EXISTS seq_user;

CREATE TABLE IF NOT EXISTS users (
																	 id INTEGER DEFAULT nextval('seq_user') PRIMARY KEY,
																	 email VARCHAR(100) NOT NULL UNIQUE,
																	 username VARCHAR (100) NOT NULL,
																	 password VARCHAR (20) NOT NULL
);

