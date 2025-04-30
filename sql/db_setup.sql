-- create user
CREATE USER 'cosc203' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'cosc203' WITH GRANT OPTION;

-- create database
DROP TABLE IF EXISTS ConservationStatus;
DROP TABLE IF EXISTS Bird;
DROP TABLE IF EXISTS Photos;
DROP DATABASE ASGN2;

CREATE DATABASE ASGN2;
USE ASGN2;

-- create tables
CREATE TABLE ConservationStatus (
    status_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(255) NOT NULL,
    status_colour CHAR(7) NOT NULL
);

CREATE TABLE Bird (
    bird_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    primary_name VARCHAR(255) NOT NULL,
    english_name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255) NOT NULL,
    order_name VARCHAR(255) NOT NULL,
    family VARCHAR(255) NOT NULL,
    length INT NOT NULL,
    weight INT NOT NULL,
    status_id INT NOT NULL,
    CONSTRAINT fk_statusid FOREIGN KEY (status_id) REFERENCES ConservationStatus(status_id) 
);

CREATE TABLE Photos (
    photo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    photographer VARCHAR(255) NOT NULL,
    bird_id INT NOT NULL,
    CONSTRAINT fk_birdid FOREIGN KEY (bird_id) REFERENCES Bird(bird_id)
);