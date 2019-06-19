/*DELETE FROM user_project;
DELETE FROM users;
DELETE FROM pages;
DELETE FROM projects;*/

DROP TABLE IF EXISTS invitations;
DROP TABLE IF EXISTS comment_entries;
DROP TABLE IF EXISTS comment_objects;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS project_versions;
DROP TABLE IF EXISTS page_versions;

DROP TABLE IF EXISTS user_project;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS projects CASCADE;

DROP TABLE IF EXISTS projectVersions CASCADE ;
DROP TABLE IF EXISTS pageVersions CASCADE ;

DROP SEQUENCE IF EXISTS seq_invitation;
DROP SEQUENCE IF EXISTS seq_user;
DROP SEQUENCE IF EXISTS seq_project;
DROP SEQUENCE IF EXISTS seq_page;
DROP SEQUENCE IF EXISTS seq_user_project;

DROP SEQUENCE IF EXISTS seq_page_version;
DROP SEQUENCE IF EXISTS seq_project_version;


