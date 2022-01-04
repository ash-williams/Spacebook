const db = require('../../config/db'),
    crypto = require('crypto');



/**
 * get the user id associated with a given token, return null if not found
 */
const getIdFromToken = function(token, done){
    if (token === undefined || token === null)
        return done(true, null);
    else {
        db.get_pool().query(
            'SELECT user_id FROM coffida_user WHERE user_token=?',
            [token],
            function(err, result){
                if (result.length === 1)
                    return done(null, result[0].user_id);
                return done(err, null);
            }
        )
    }
};



const getHash = function(password, salt){
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
};



/**
 * insert user
 */
const insert = function(user, done){

    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);

    //console.log(salt);

    let values = [[user.first_name, user.last_name, user.email, hash, salt.toString('hex')]];

    db.get_pool().query(
        'INSERT INTO coffida_user (user_givenname, user_familyname, user_email, user_password, user_salt) VALUES (?)',
        values,
        function(err, results){
            if (err) return done(err);

            return done(err, results.insertId)
        }
    );
};



/*
 *   authenticate user
 */
const authenticate = function(email, password, done){
    db.get_pool().query(
        'SELECT user_id, user_password, user_salt FROM coffida_user WHERE (user_email=?)',
        [email],
        function(err, results) {

            if (err || results.length !== 1){
                console.log("AUTH 1", err, results.length);
                return done(true); // return error = true (failed auth)
            }else{

                if(results[0].user_salt == null){
                    results[0].user_salt = '';
                }

                let salt = Buffer.from(results[0].user_salt, 'hex');

                if (results[0].user_password === getHash(password, salt)){
                    return done(false, results[0].user_id);
                }else{
                    console.log("failed passwd check");
                    return done(true); // failed password check
                }

            }
        }
    );
};



/**
 * get existing token
 *
 */
const getToken = function(id, done){
    db.get_pool().query(
        'SELECT user_token FROM coffida_user WHERE user_id=?',
        [id],
        function(err, results){
            if (results.length === 1 && results[0].token)
                return done(null, results[0].token);
            return done(null, null);
        }
    );
};



/**
 * create and store a new token for a user
 */
const setToken = function(id, done){
    let token = crypto.randomBytes(16).toString('hex');
    db.get_pool().query(
        'UPDATE coffida_user SET user_token=? WHERE user_id=?',
        [token, id],
        function(err){return done(err, token)}
    );
};



/**
 * remove a token for a user
 */
const removeToken = (token, done) => {
    db.get_pool().query(
        'UPDATE coffida_user SET user_token=null WHERE user_token=?',
        [token],
        function(err){return done(err)}
    )
};



function get_reviews(item, done){
  let review_query = 'SELECT r.review_id, r.review_location_id, r.review_user_id, r.review_overallrating, r.review_pricerating, r.review_qualityrating, r.review_clenlinessrating, r.review_body, COUNT(liked.liked_review_id) as likes ' +
                     'FROM coffida_review r LEFT JOIN coffida_liked liked ON r.review_id = liked.liked_review_id ' +
                     'WHERE review_location_id = ? GROUP BY r.review_id';

  db.get_pool().query(review_query, [item['location_id']], function(err, reviews){
    if(err) return done(err, false);

    return done(null, reviews);

  });
}



const favourite_info = async (favourites, done) => {
  let results = [];

  await favourites.forEach(async (item) => {
    let result = {
      "location_id": item["location_id"],
      "location_name": item["location_name"],
      "location_town": item["location_town"],
      "latitude": item["location_latitude"],
      "longitude": item["location_longitude"],
      "photo_path": item["location_photopath"],
      "avg_overall_rating": item['avg_overall_rating'],
      "avg_price_rating": item['avg_price_rating'],
      "avg_quality_rating": item['avg_quality_rating'],
      "avg_clenliness_rating": item['avg_clenliness_rating'],
      "location_reviews": []
    };

    await get_reviews(item, (err, reviews) => {

      result["location_reviews"] = reviews;

      // console.log(result);
      results.push(result);
      if(results.length == favourites.length){
        return done(results);
      }
    });
  });
}



const getFavourites = async (id, done) => {
  let favourite_query = 'SELECT l.location_id, l.location_name, l.location_town, l.location_photopath, l.location_latitude, l.location_longitude, AVG(r.review_overallrating) AS avg_overall_rating, AVG(r.review_pricerating) AS avg_price_rating, AVG(r.review_qualityrating) AS avg_quality_rating, AVG(r.review_clenlinessrating) AS avg_clenliness_rating  ' +
                        'FROM coffida_location l LEFT JOIN coffida_review r ON l.location_id = r.review_location_id ' +
                        'WHERE l.location_id IN (SELECT f.favourite_location_id FROM coffida_favourite f WHERE f.favourite_user_id = ?) ' +
                        'GROUP BY l.location_id';

  db.get_pool().query(favourite_query, [id], async function(err, favourites){
    if(err) {
      return done(err, false);
    }else if(favourites.length == 0){
        return done(false, []);
    }else{
      await favourite_info(favourites, (results) => {
        console.log(results);
        return done(null, results);
      });
    }
  });
}



const review_info = async (reviews, done) => {
  let results = [];

  await reviews.forEach(async (item) => {

    let q = 'SELECT COUNT(liked.liked_review_id) as likes FROM coffida_liked liked WHERE liked.liked_review_id=?';

    db.get_pool().query(q, [item['review_id']], async function(err, likes){
      if(err) {
        return done(err, false);
      }else if(reviews.length == 0){
          return done(false, []);
      }else{

        let result = {
              "review": {
                "review_id": item['review_id'],
                "overall_rating": item['review_overallrating'],
                "price_rating": item['review_pricerating'],
                "quality_rating": item['review_qualityrating'],
                "clenliness_rating": item['review_clenlinessrating'],
                "review_body": item['review_body'],
                "likes": likes[0]['likes'],
              },
              "location": {
                "location_id": item['location_id'],
                "location_name": item['location_name'],
                "location_town": item['location_town'],
                "latitude": item['location_latitude'],
                "longitude": item['location_longitude'],
                "photo_path": item['location_photopath'],
                "avg_overall_rating": item['avg_overall_rating'],
                "avg_price_rating": item['avg_price_rating'],
                "avg_quality_rating": item['avg_quality_rating'],
                "avg_clenliness_rating": item['avg_clenliness_rating'],
              }
        };

        results.push(result);
        if(results.length == reviews.length){
          return done(results);
        }
      }
    });
  });
}



const getReviews = async (id, done) => {
  let review_query = 'SELECT r.review_id, r.review_overallrating, r.review_pricerating, r.review_qualityrating, r.review_clenlinessrating, r.review_body, COUNT(liked.liked_review_id) as likes, l.location_id, l.location_name, l.location_town, l.location_latitude, l.location_longitude, l.location_photopath, AVG(rev.review_overallrating) AS avg_overall_rating, AVG(rev.review_pricerating) AS avg_price_rating, AVG(rev.review_qualityrating) AS avg_quality_rating, AVG(rev.review_clenlinessrating) AS avg_clenliness_rating ' +
                      'FROM coffida_review r LEFT JOIN coffida_liked liked ON r.review_id = liked.liked_review_id LEFT JOIN coffida_location l ON r.review_location_id = l.location_id LEFT JOIN coffida_review rev ON l.location_id = rev.review_location_id ' +
                      'WHERE r.review_user_id = ? GROUP BY r.review_id';
  db.get_pool().query(review_query, [id], async function(err, reviews){
    if(err) {
      return done(err, false);
    }else if(reviews.length == 0){
        return done(false, []);
    }else{
      await review_info(reviews, (results) => {
        console.log(results);
        return done(null, results);
      });
    }
  });
}



const getLikedReviews = async (id, done) => {
  let liked_review_query = 'SELECT r.review_id, r.review_overallrating, r.review_pricerating, r.review_qualityrating, r.review_clenlinessrating, r.review_body, COUNT(liked.liked_review_id) as likes, l.location_id, l.location_name, l.location_town, l.location_latitude, l.location_longitude, l.location_photopath, AVG(rev.review_overallrating) AS avg_overall_rating, AVG(rev.review_pricerating) AS avg_price_rating, AVG(rev.review_qualityrating) AS avg_quality_rating, AVG(rev.review_clenlinessrating) AS avg_clenliness_rating ' +
                      'FROM coffida_review r LEFT JOIN coffida_liked liked ON r.review_id = liked.liked_review_id LEFT JOIN coffida_location l ON r.review_location_id = l.location_id LEFT JOIN coffida_review rev ON l.location_id = rev.review_location_id ' +
                      'WHERE liked.liked_user_id = ? GROUP BY r.review_id';
  db.get_pool().query(liked_review_query, [id], async function(err, reviews){
    if(err) {
      return done(err, false);
    }else if(reviews.length == 0){
        return done(false, []);
    }else{
      await review_info(reviews, (results) => {
        console.log(results);
        return done(null, results);
      });
    }
  });
}



/**
 * return user details, or null if user not found
 *
 * @param id
 * @param done
 */
const getOne = async (id, done) => {
    let query = 'SELECT coffida_user.user_id, coffida_user.user_givenname, coffida_user.user_familyname, coffida_user.user_email FROM coffida_user WHERE coffida_user.user_id=?';
    db.get_pool().query(
        query,
        [id],
        function(err, results){
            if (err){
                return done(err, false);
            }else if(results.length == 0){
                return done(false, null);
            }else{
                let user = results[0];

                let to_return = {
                    "user_id": user.user_id,
                    "first_name": user.user_givenname,
                    "last_name": user.user_familyname,
                    "email": user.user_email
                };

                console.log("here");

                getFavourites(user.user_id, function(err, results){
                  if (err){ return done(err, false)}
                  console.log("favourites");
                  to_return["favourite_locations"] = results;

                  getReviews(user.user_id, function(err, results){
                      to_return["reviews"] = results;
                      console.log("reviews");
                      getLikedReviews(user.user_id, function(err, results){
                          to_return['liked_reviews'] = results
                          console.log("liked reviews");
                          return done(null, to_return);
                      });
                  });
                });
            }
        }
    )
};



/**
 * return user details, or null if user not found
 *
 * @param id
 * @param done
 */
const getJustUser = (id, done) => {
    // console.log("1");
    let query = 'SELECT coffida_user.user_id, coffida_user.user_givenname, coffida_user.user_familyname, coffida_user.user_email FROM coffida_user WHERE user_id=?';
    db.get_pool().query(
        query,
        [id],
        function(err, results){
            if (err){
                // console.log(err);
                return done(err, false);
            }else if(results.length == 0){
                return done(false, null);
            }else{
                let user = results[0];
                let to_return = {
                  "user_id": user.user_id,
                  "first_name": user.user_givenname,
                  "last_name": user.user_familyname,
                  "email": user.user_email
                };
                return done(null, to_return);
            }
    });
};



/**
 * update user
 *
 */
const alter = function(id, user, done){

    let query_string = '';
    let values = [];

    if(user.hasOwnProperty('password')){
        const salt = crypto.randomBytes(64);
        const hash = getHash(user.password, salt);

        query_string = 'UPDATE coffida_user SET user_givenname=?, user_familyname=?, user_email=?, user_password=?, user_salt=? WHERE user_id=?';
        values = [user.first_name, user.last_name, user.email, hash, salt.toString('hex'), id];
    }else{
        query_string = 'UPDATE coffida_user SET user_givenname=?, user_familyname=?, user_email=? WHERE user_id=?';
        values = [user.first_name, user.last_name, user.email, id];
    }

    db.get_pool().query(query_string,
        values,
        function(err, results){
            done(err);
        }
    );
};



module.exports = {
    getIdFromToken: getIdFromToken,
    insert: insert,
    authenticate: authenticate,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    getOne: getOne,
    getJustUser: getJustUser,
    alter: alter
};
