const db = require('../../config/db');



/**
 * return location details, or null if user not found
 *
 * @param id
 * @param done
 */
const getOne = (id, done) => {
    // console.log("1");
    let query = 'SELECT l.location_id, l.location_name, l.location_town, l.location_photopath, l.location_latitude, l.location_longitude, AVG(r.review_overallrating) AS avg_overall_rating, AVG(r.review_pricerating) AS avg_price_rating, AVG(r.review_qualityrating) AS avg_quality_rating, AVG(r.review_clenlinessrating) AS avg_clenliness_rating ' +
                'FROM coffida_location l LEFT JOIN coffida_review r ON l.location_id = r.review_location_id ' +
                'WHERE l.location_id = ? GROUP BY l.location_id';

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
                let location = results[0];
                let to_return = {
                  "location_id": location["location_id"],
                  "location_name": location["location_name"],
                  "location_town": location["location_town"],
                  "latitude": location["location_latitude"],
                  "longitude": location["location_longitude"],
                  "photo_path": location["location_photopath"],
                  "avg_overall_rating": location['avg_overall_rating'],
                  "avg_price_rating": location['avg_price_rating'],
                  "avg_quality_rating": location["avg_quality_rating"],
                  "avg_clenliness_rating": location["avg_clenliness_rating"]
                }

                let r_query = 'SELECT r.review_id, r.review_overallrating AS overall_rating, r.review_pricerating AS price_rating, r.review_qualityrating AS quality_rating, r.review_clenlinessrating AS clenliness_rating, r.review_body, COUNT(liked.liked_review_id) as likes ' +
                              'FROM coffida_review r LEFT JOIN coffida_liked liked ON r.review_id = liked.liked_review_id ' +
                              'WHERE r.review_location_id= ? GROUP BY r.review_id';

                db.get_pool().query(
                  r_query,
                  [location["location_id"]],
                  function(err, reviews){
                    if(err){
                      return done(err, false);
                    }else{
                      to_return["location_reviews"] = reviews;
                      return done(null, to_return);
                    }
                  }
                );



            }
    });
};



const addFavourite = (usr_id, loc_id, done) => {
  let query_string = 'INSERT INTO coffida_favourite (favourite_user_id, favourite_location_id) VALUES (?)';
  let values = [[usr_id, loc_id]];

  db.get_pool().query(query_string,
      values,
      function(err, results){
          done(err);
      }
  );
}



const deleteFavourite = (usr_id, loc_id, done) => {
  let query_string = 'DELETE FROM coffida_favourite WHERE favourite_user_id=? AND favourite_location_id=?';
  let values = [usr_id, loc_id];

  db.get_pool().query(query_string,
      values,
      function(err, results){
          done(err);
      }
  );
}



const get_reviews = (item, done) => {
  let review_query = 'SELECT r.review_id, r.review_location_id, r.review_user_id, r.review_overallrating, r.review_pricerating, r.review_qualityrating, r.review_clenlinessrating, r.review_body, COUNT(liked.liked_review_id) as likes ' +
                     'FROM coffida_review r LEFT JOIN coffida_liked liked ON r.review_id = liked.liked_review_id ' +
                     'WHERE review_location_id = ? GROUP BY r.review_id';

  db.get_pool().query(review_query, [item['location_id']], function(err, reviews){
    if(err) return done(err, false);

    return done(null, reviews);

  });
}



const review_info = async (locations, done) => {
  let results = [];

  await locations.forEach(async (item) => {
    await get_reviews(item, (err, reviews) => {
      item['location_reviews'] = reviews;
      results.push(item);

      if(results.length == locations.length){
        return done(results);
      }
    });
  });

}



const find = (params, user_id, done) => {
  let q = 'SELECT l.location_id, l.location_name, l.location_town, l.location_photopath AS photo_path, l.location_latitude AS latitude, l.location_longitude AS longitude, AVG(coalesce(r.review_overallrating,0)) AS avg_overall_rating, AVG(coalesce(r.review_pricerating,0)) AS avg_price_rating, AVG(coalesce(r.review_qualityrating,0)) AS avg_quality_rating, AVG(coalesce(r.review_clenlinessrating,0)) AS avg_clenliness_rating ' +
          'FROM coffida_location l LEFT JOIN coffida_review r ON l.location_id = r.review_location_id ';

  if(params.q){
    q += "WHERE l.location_name LIKE '%" + params.q + "%' OR l.location_town LIKE '%" + params.q + "%' ";
  }

  q += "GROUP BY l.location_id ";
  q += "HAVING ";

  console.log("OVERALL_RATING", params.overall_rating);
  if(params.overall_rating){
    params.overall_rating = parseInt(params.overall_rating);
  }

  if(params.price_rating){
    params.price_rating = parseInt(params.price_rating);
  }

  if(params.quality_rating){
    params.quality_rating = parseInt(params.quality_rating);
  }

  if(params.clenliness_rating){
    params.clenliness_rating = parseInt(params.clenliness_rating);
  }


  if(params.overall_rating && Number.isInteger(params.overall_rating) && params.overall_rating >= 0 && params.overall_rating <=5){
    q += "avg_overall_rating >=" + params.overall_rating + " ";
  }else{
    q += "avg_overall_rating >=0 ";
  }

  if(params.price_rating && Number.isInteger(params.price_rating) && params.price_rating >= 0 && params.price_rating <=5){
    q += "AND avg_price_rating >=" + params.price_rating + " ";
  }else{
    q += "AND avg_price_rating >=0 ";
  }

  if(params.quality_rating && Number.isInteger(params.quality_rating) && params.quality_rating >= 0 && params.quality_rating <=5){
    q += "AND avg_quality_rating >=" + params.quality_rating + " ";
  }else{
    q += "AND avg_quality_rating >=0 ";
  }

  if(params.clenliness_rating && Number.isInteger(params.clenliness_rating) && params.clenliness_rating >= 0 && params.clenliness_rating <=5){
    q += "AND avg_clenliness_rating >=" + params.clenliness_rating + " ";
  }else{
    q += "AND avg_clenliness_rating >=0 ";
  }

  if(params.search_in){
    if(params.search_in == "favourite"){
      q += "AND l.location_id IN (SELECT f.favourite_location_id FROM coffida_favourite f WHERE f.favourite_user_id=" + user_id +") ";
    }

    if(params.search_in == "reviewed"){
      q += "AND l.location_id IN (SELECT r.review_location_id FROM coffida_review r WHERE r.review_user_id=" + user_id +") ";
    }
  }

  if(params.limit && params.limit >= 1 && params.limit <= 100){
    q += "LIMIT " + params.limit + " ";
  }else{
    q += "LIMIT 20 ";
  }

  if(params.offset && params.offset >= 0){
    q += "OFFSET " + params.offset + " ";
  }else{
    q += "OFFSET 0 ";
  }

  // console.log(q);

  db.get_pool().query(
        q,
        async function(err, locations){
            if(err){
                console.log(err);
                return done(err, false);
            }else if(locations.length ==0){
                console.log("empty");
                return done(err, []);
            }else{
                await review_info(locations, (results) => {
                  return done(null, results);
                });
            }
        }
    );
}


module.exports = {
    getOne: getOne,
    addFavourite: addFavourite,
    deleteFavourite: deleteFavourite,
    find: find
};
