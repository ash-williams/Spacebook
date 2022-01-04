use ashley_student;

INSERT INTO spacebook_users (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Ashley", "Williams", "ashley.williams@mmu.ac.uk", "this account wont work", "because these values aren't hashed");
INSERT INTO spacebook_users (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Matthew", "Henry", "m.henry@gmail.com", "this account wont work", "because these values aren't hashed");
INSERT INTO spacebook_users (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("John", "Smith", "john.smith@gmail.com", "this account wont work", "because these values aren't hashed");
INSERT INTO spacebook_users (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Euan", "McGuill", "e.mcguill@gmail.com", "this account wont work", "because these values aren't hashed");
INSERT INTO spacebook_users (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Manuel", "Perez", "mperez@live.com", "this account wont work", "because these values aren't hashed");
INSERT INTO spacebook_users (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Hannah", "Barry", "hbazza@gmail.com", "this account wont work", "because these values aren't hashed");
INSERT INTO spacebook_users (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES ("Karin", "Johnson", "hello@karin.com", "this account wont work", "because these values aren't hashed");

INSERT INTO spacebook_posts (post_text, post_author, post_profile) VALUES ("Finally got on Spacebook",1,1);
INSERT INTO spacebook_posts (post_text, post_author, post_profile) VALUES ("Hey Matt, hows things?",1,2);
INSERT INTO spacebook_posts (post_text, post_author, post_profile) VALUES ("Who's that knocking on your door?",1,4);
INSERT INTO spacebook_posts (post_text, post_author, post_profile) VALUES ("It's got to be a quarter to four?",4,1);
INSERT INTO spacebook_posts (post_text, post_author, post_profile) VALUES ("Hello Stranger.",6,7);
INSERT INTO spacebook_posts (post_text, post_author, post_profile) VALUES ("I suppose that I could collect my books and go back to school...",5,5);
INSERT INTO spacebook_posts (post_text, post_author, post_profile) VALUES ("I wish I was a fisherman, tumbling on the sea",3,3);
INSERT INTO spacebook_posts (post_text, post_author, post_profile) VALUES ("Bruce Willis was a ghost the whole time!",7,7);

INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (1,2,"REQUESTED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (1,3,"REQUESTED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (1,4,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (1,5,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (1,6,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (1,7,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (2,3,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (2,4,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (2,5,"REQUESTED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (2,6,"REQUESTED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (2,7,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (3,4,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (3,5,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (3,6,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (3,7,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (4,5,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (4,6,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (4,7,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (5,6,"CONFIRMED");
INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (5,7,"CONFIRMED");


INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (4,1);
INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (4,2);
INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (4,3);
INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (4,4);
INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (4,5);
INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (4,6);
INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (4,7);
INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (1,5);
INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (1,6);
INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (1,7);
INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (8,4);
INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (8,5);

