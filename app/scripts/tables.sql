# MySQL scripts for creating/recreating the database
#
# Version:		1.0.0
# Date:			21 September 2020
# Author:		Ashley Williams

## Dont do this on mudfoot
# First create the database if it does not already exist...
# CREATE DATABASE IF NOT EXISTS coffida;

USE ashley_student; # Change to your mudfoot username

# First drop the tables if they do not already exist
# Note: has to be done in a certian order for referential integrity

DROP TABLE IF EXISTS coffida_liked;
DROP TABLE IF EXISTS coffida_favourite;
DROP TABLE IF EXISTS coffida_review;
DROP TABLE IF EXISTS coffida_location;
DROP TABLE IF EXISTS coffida_user;

# Now create the tables...
# Note: again, this has to be done in a particular order. Essentially the opposite to the drops.

CREATE TABLE coffida_user (
  user_id int(10) NOT NULL AUTO_INCREMENT,
  user_givenname varchar(50) NOT NULL,
  user_familyname varchar(50) NOT NULL,
  user_email varchar(320) NOT NULL,
  user_password varchar(512) NOT NULL,
  user_salt varchar(128) NOT NULL,
  user_token varchar(32) DEFAULT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY user_id (user_id),
  UNIQUE KEY user_email (user_email),
  UNIQUE KEY user_token (user_token)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE coffida_location (
  location_id int(10) NOT NULL AUTO_INCREMENT,
  location_name varchar(100) NOT NULL,
  location_town varchar(100) NOT NULL,
  location_photopath varchar(255) NOT NULL,
  location_latitude decimal(8,6) NOT NULL,	# 90 to -90 degrees to 6d.p.
  location_longitude decimal(9,6) NOT NULL, 	# 180 to -180 degrees
  PRIMARY KEY (location_id),
  UNIQUE KEY location_id (location_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE coffida_review (
  review_id int(10) NOT NULL AUTO_INCREMENT,
  review_location_id int(10) NOT NULL,
  review_user_id int(10) NOT NULL,
  review_overallrating int(1) NOT NULL,
  review_pricerating int(1) NOT NULL,
  review_qualityrating int(1) NOT NULL,
  review_clenlinessrating int(1) NOT NULL,
  review_body varchar(500) NOT NULL,
  PRIMARY KEY (review_id),
  UNIQUE KEY review_id (review_id),
  CONSTRAINT fk_review_locationid FOREIGN KEY (review_location_id) REFERENCES coffida_location (location_id),
  CONSTRAINT fk_review_userid FOREIGN KEY (review_user_id) REFERENCES coffida_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE coffida_favourite (
  favourite_location_id int(10) NOT NULL,
  favourite_user_id int(10) NOT NULL,
  PRIMARY KEY (favourite_user_id, favourite_location_id),
  CONSTRAINT fk_favourite_locationid FOREIGN KEY (favourite_location_id) REFERENCES coffida_location (location_id),
  CONSTRAINT fk_favourite_userid FOREIGN KEY (favourite_user_id) REFERENCES coffida_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE coffida_liked (
  liked_review_id int(10) NOT NULL,
  liked_user_id int(10) NOT NULL,
  PRIMARY KEY (liked_review_id, liked_user_id),
  CONSTRAINT fk_liked_reviewid FOREIGN KEY (liked_review_id) REFERENCES coffida_review (review_id),
  CONSTRAINT fk_liked_userid FOREIGN KEY (liked_user_id) REFERENCES coffida_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
