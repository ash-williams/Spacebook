use ashley_student;

INSERT INTO coffida_user (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Ashley", "Williams", "ashley.williams@mmu.ac.uk", "this account wont work", "because these values aren't hashed");
INSERT INTO coffida_user (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Matthew", "Henry", "m.henry@gmail.com", "this account wont work", "because these values aren't hashed");
INSERT INTO coffida_user (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("John", "Smith", "john.smith@gmail.com", "this account wont work", "because these values aren't hashed");
INSERT INTO coffida_user (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Euan", "McGuill", "e.mcguill@gmail.com", "this account wont work", "because these values aren't hashed");
INSERT INTO coffida_user (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Manuel", "Perez", "mperez@live.com", "this account wont work", "because these values aren't hashed");
INSERT INTO coffida_user (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Hannah", "Barry", "hbazza@gmail.com", "this account wont work", "because these values aren't hashed");
INSERT INTO coffida_user (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Karin", "Johnson", "hello@karin.com", "this account wont work", "because these values aren't hashed");

INSERT INTO coffida_location (location_name, location_town, location_photopath, location_latitude, location_longitude) VALUES ("Just Coffee", "London", "http://cdn.dummyphoto.com", 80, 0);
INSERT INTO coffida_location (location_name, location_town, location_photopath, location_latitude, location_longitude) VALUES ("Coffee", "Manchester", "http://cdn.dummyphoto.com",  80, 0);
INSERT INTO coffida_location (location_name, location_town, location_photopath, location_latitude, location_longitude) VALUES ("Mary's", "London", "http://cdn.dummyphoto.com",  80, 0);
INSERT INTO coffida_location (location_name, location_town, location_photopath, location_latitude, location_longitude) VALUES ("Ben's Diner", "London", "http://cdn.dummyphoto.com",  80, 0);
INSERT INTO coffida_location (location_name, location_town, location_photopath, location_latitude, location_longitude) VALUES ("Just Coffee", "Manchester", "http://cdn.dummyphoto.com",  80, 0);

INSERT INTO coffida_review (review_location_id, review_user_id, review_overallrating, review_pricerating, review_qualityrating, review_clenlinessrating, review_body) VALUES (1,1,4,5,3,4,"Great atomosphere, great coffee");
INSERT INTO coffida_review (review_location_id, review_user_id, review_overallrating, review_pricerating, review_qualityrating, review_clenlinessrating, review_body) VALUES (4,1,1,1,1,0,"Grim, and expensive");
INSERT INTO coffida_review (review_location_id, review_user_id, review_overallrating, review_pricerating, review_qualityrating, review_clenlinessrating, review_body) VALUES (1,1,3,3,3,3,"Not as good now that they've upped their prices");
INSERT INTO coffida_review (review_location_id, review_user_id, review_overallrating, review_pricerating, review_qualityrating, review_clenlinessrating, review_body) VALUES (2,3,4,5,3,4,"I like the coffee");
INSERT INTO coffida_review (review_location_id, review_user_id, review_overallrating, review_pricerating, review_qualityrating, review_clenlinessrating, review_body) VALUES (4,6,5,5,5,5,"Not sure what the problem is, I love it here");
INSERT INTO coffida_review (review_location_id, review_user_id, review_overallrating, review_pricerating, review_qualityrating, review_clenlinessrating, review_body) VALUES (5,6,4,5,3,4,"Service needs work, but always tastes alright");

INSERT INTO coffida_favourite (favourite_location_id, favourite_user_id) VALUES (1,1);
INSERT INTO coffida_favourite (favourite_location_id, favourite_user_id) VALUES (2,1);
INSERT INTO coffida_favourite (favourite_location_id, favourite_user_id) VALUES (3,1);
INSERT INTO coffida_favourite (favourite_location_id, favourite_user_id) VALUES (4,2);
INSERT INTO coffida_favourite (favourite_location_id, favourite_user_id) VALUES (1,5);
INSERT INTO coffida_favourite (favourite_location_id, favourite_user_id) VALUES (3,5);
INSERT INTO coffida_favourite (favourite_location_id, favourite_user_id) VALUES (2,5);

INSERT INTO coffida_liked (liked_review_id, liked_user_id) VALUES (1,1);
INSERT INTO coffida_liked (liked_review_id, liked_user_id) VALUES (2,1);
INSERT INTO coffida_liked (liked_review_id, liked_user_id) VALUES (3,1);
INSERT INTO coffida_liked (liked_review_id, liked_user_id) VALUES (1,3);
INSERT INTO coffida_liked (liked_review_id, liked_user_id) VALUES (2,3);
INSERT INTO coffida_liked (liked_review_id, liked_user_id) VALUES (2,4);
INSERT INTO coffida_liked (liked_review_id, liked_user_id) VALUES (3,5);
