# MySQL scripts for creating/recreating the database
#
# Version:		1.0.0
# Date:			4 January 2022
# Author:		Ashley Williams

## Dont do this on mudfoot
# First create the database if it does not already exist...
# CREATE DATABASE IF NOT EXISTS spacebook;

USE ashley_student; # Change to your mudfoot username

# First drop the tables if they do not already exist
# Note: has to be done in a certian order for referential integrity

DROP TABLE IF EXISTS spacebook_likes;
DROP TABLE IF EXISTS spacebook_friends;
DROP TABLE IF EXISTS spacebook_posts;
DROP TABLE IF EXISTS spacebook_users;

# Now create the tables...
# Note: again, this has to be done in a particular order. Essentially the opposite to the drops.

CREATE TABLE spacebook_users (
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

CREATE TABLE spacebook_posts (
  post_id int(10) NOT NULL AUTO_INCREMENT,
  post_text varchar(500) NOT NULL,
  post_author int(10) NOT NULL,
  post_profile int(10) NOT NULL,
  post_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id),
  UNIQUE KEY post_id (post_id)
  CONSTRAINT fk_post_author FOREIGN KEY (post_author) REFERENCES spacebook_users (user_id)
  CONSTRAINT fk_post_profile FOREIGN KEY (post_profile) REFERENCES spacebook_users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE spacebook_friends (
  friend_user_id int(10) NOT NULL,
  friend_friend_id int(10) NOT NULL,
  status varchar(50) NOT NULL,
  PRIMARY KEY (user_id, friend_id),
  CONSTRAINT fk_friend_userid FOREIGN KEY (friend_user_id) REFERENCES spacebook_users (user_id),
  CONSTRAINT fk_friend_friendid FOREIGN KEY (friend_friend_id) REFERENCES spacebook_users (user_id)


CREATE TABLE spacebook_likes (
  like_post_id int(10) NOT NULL,
  like_user_id int(10) NOT NULL,
  PRIMARY KEY (post_id, user_id),
  CONSTRAINT fk_likes_postid FOREIGN KEY (like_post_id) REFERENCES spacebook_posts (post_id),
  CONSTRAINT fk_likes_userid FOREIGN KEY (like_user_id) REFERENCES spacebook_users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
