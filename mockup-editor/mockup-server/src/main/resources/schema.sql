CREATE SEQUENCE IF NOT EXISTS seq_user;
CREATE SEQUENCE IF NOT EXISTS seq_project;
CREATE SEQUENCE IF NOT EXISTS seq_page;
CREATE SEQUENCE IF NOT EXISTS seq_user_project;
CREATE SEQUENCE IF NOT EXISTS seq_invitation;
CREATE SEQUENCE IF NOT EXISTS seq_comment;

CREATE SEQUENCE IF NOT EXISTS seq_page_version;
CREATE SEQUENCE IF NOT EXISTS seq_project_version;

CREATE TABLE IF NOT EXISTS users
(
    id       INTEGER DEFAULT nextval('seq_user') PRIMARY KEY,
    email    VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects
(
    id            INTEGER DEFAULT nextval('seq_project') PRIMARY KEY,
    project_name  VARCHAR(100) NOT NULL,
    last_modified DATE

);

CREATE TABLE IF NOT EXISTS user_project
(
    id         INTEGER DEFAULT nextval('seq_project') NOT NULL,
    user_id    INTEGER                                NOT NULL,
    project_id INTEGER                                NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, project_id)
);

CREATE TABLE IF NOT EXISTS pages
(
    id          INTEGER DEFAULT nextval('seq_page') PRIMARY KEY,
    page_name   VARCHAR(100) NOT NULL,
    page_height INTEGER      NOT NULL,
    page_width  INTEGER      NOT NULL,
    page_order  INTEGER      NOT NULL,
    page_data   json         NOT NULL,
    project_id  INTEGER,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS invitations
(
    id              INTEGER DEFAULT nextval('seq_invitation') PRIMARY KEY,
    project_id      INTEGER NOT NULL,
    inviter_user_id INTEGER NOT NULL,
    invitee_user_id INTEGER NOT NULL,
    status          INTEGER NOT NULL,
    FOREIGN KEY (inviter_user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (invitee_user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments
(
    id      INTEGER DEFAULT nextval('seq_comment') PRIMARY KEY,
    uuid  VARCHAR(100),
    page_id INTEGER NOT NULL,
    cleared BOOLEAN,
    FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment_objects
(
    id         INTEGER DEFAULT nextval('seq_comment') PRIMARY KEY,
    comment_id INTEGER,
    object_id  VARCHAR(100),
    FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment_entries
(
    id          INTEGER DEFAULT nextval('seq_comment') PRIMARY KEY,
    entry_order INTEGER   NOT NULL,
    message     VARCHAR(1000),
    user_id     INTEGER   NOT NULL,
    comment_id  INTEGER   NOT NULL,
    date        timestamp NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projectVersions
(
    id            INTEGER DEFAULT nextval('seq_project_version') PRIMARY KEY,
    version_name  VARCHAR(100) NOT NULL,
    project_id    INTEGER      NOT NULL,
    last_modified DATE,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pageVersions
(
    id                 INTEGER DEFAULT nextval('seq_page_version') PRIMARY KEY,
    page_name          VARCHAR(100) NOT NULL,
    page_height        INTEGER      NOT NULL,
    page_width         INTEGER      NOT NULL,
    page_order         INTEGER      NOT NULL,
    page_data          json         NOT NULL,
    projectVersions_id INTEGER      NOT NULL,
    FOREIGN KEY (projectVersions_id) REFERENCES projectVersions (id) ON DELETE CASCADE
);
