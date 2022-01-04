const db = require('../../config/db');

const fs = require('fs');
const photosDirectory = './storage/photos/';
const photo_tools = require('../lib/photo.tools.js');


/**
 * insert review
 */
const insert = function(review, loc_id, usr_id, done){
    let values = [[loc_id, usr_id, review.overall_rating, review.price_rating, review.quality_rating, review.clenliness_rating, review.review_body]];

    db.get_pool().query(
        'INSERT INTO coffida_review (review_location_id, review_user_id, review_overallrating, review_pricerating, review_qualityrating, review_clenlinessrating, review_body) VALUES (?)',
        values,
        function(err, results){
          if(err) {
            return done(err, false);
          }else{
            return done(err, results.insertId)
          }
        }
    );
};



/**
 * return review details, or null if user not found
 *
 * @param id
 * @param done
 */
const getOne = (id, done) => {
    // console.log("1");
    let query = 'SELECT r.review_id, r.review_location_id, r.review_user_id, r.review_overallrating, r.review_pricerating, r.review_qualityrating, r.review_clenlinessrating, r.review_body ' +
                'FROM coffida_review r WHERE r.review_id = ?';
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
                let review = results[0];
                let to_return = {
                  "review_id": review['review_id'],
                  "location_id": review['review_location_id'],
                  "user_id": review['review_user_id'],
                  "overall_rating": review['review_overallrating'],
                  "price_rating": review['review_pricerating'],
                  "quality_rating": review['review_qualityrating'],
                  "clenliness_rating": review['review_clenlinessrating'],
                  "review_body": review['review_body']
                }
                return done(null, to_return);
            }
          })

};



/**
 * update review
 *
 */
const alter = function(id, review, done){

    let query_string = 'UPDATE coffida_review SET review_overallrating=?, review_pricerating=?, review_qualityrating=?, review_clenlinessrating=?, review_body=? WHERE review_id=?';
    let values = [review.overall_rating, review.price_rating, review.quality_rating, review.clenliness_rating, review.review_body, id];


    db.get_pool().query(query_string,
        values,
        function(err, results){
            done(err);
        }
    );
};



/**
 * delete review
 *
 */
const deleteReview = function(id, done){

    let query_string = 'DELETE FROM coffida_review WHERE review_id=?';
    let values = [id];

    db.get_pool().query(query_string,
        values,
        function(err, results){
            done(err);
        }
    );
};



const addPhoto = async function(image, fileExt, rev_id, done){
  let filename = rev_id + fileExt;

  try{
    const path = photosDirectory + filename;

    fs.writeFile(path, image.body, function(err, result){
      if(err){
        return done(err);
      }else{
        console.log("RESULT", result);
        return done(null);
      }
    });
  }catch (err){
    console.log(err);
    fs.unlink(photosDirectory + filename).catch(err => done(err));
    done(err);
  }
}



const deletePhotoIfExists = async function(rev_id, done){
  let filename_png = photosDirectory + rev_id + ".png";
  let filename_jpg = photosDirectory + rev_id + ".jpeg";

  fs.exists(filename_png, (exists) => {
    console.log("PNG exists: ", exists, filename_png);
    if(!exists){
      fs.exists(filename_jpg, (exists) => {
        console.log("JPEG exists: ", exists, filename_jpg);
        if(!exists){
          done(null);
        }else{
          console.log("JPG Exists, time to delete...");
          fs.unlink(filename_jpg, (err) => {
            if(err){
              done(err);
            }else{
              done(null);
            }
          });
        }
      });
    }else{
      console.log("PNG Exists, time to delete...");
      fs.unlink(filename_png, (err) => {
        if(err){
          done(err);
        }else{
          done(null);
        }
      });
    }
  });
}



const retreivePhoto = async function(rev_id, done){
  let filename_png = photosDirectory + rev_id + ".png";
  let filename_jpg = photosDirectory + rev_id + ".jpeg";

  fs.exists(filename_png, (exists) => {
    console.log("PNG exists: ", exists, filename_png);
    if(!exists){
      fs.exists(filename_jpg, (exists) => {
        console.log("JPEG exists: ", exists, filename_jpg);
        if(!exists){
          done(null, "Doesn't exist");
        }else{
          console.log("JPG Exists, time to read...");

          fs.readFile(filename_jpg, (err, image) => {
            if(err){
              done(null, err);
            }else{
              let mimeType = photo_tools.getImageMimetype(filename_jpg);
              done({image, mimeType}, null);
            }
          });

        }
      });
    }else{
      console.log("PNG Exists, time to read...");

      fs.readFile(filename_png, (err, image) => {
        if(err){
          done(null, err);
        }else{
          let mimeType = photo_tools.getImageMimetype(filename_png);
          done({image, mimeType}, null);
        }
      });

    }
  });
}



const addReviewLike = (usr_id, rev_id, done) => {
  let query_string = 'INSERT INTO coffida_liked (liked_user_id, liked_review_id) VALUES (?)';
  let values = [[usr_id, rev_id]];


  db.get_pool().query(query_string,
      values,
      function(err, results){
          done(err);
      }
  );
}



const deleteReviewLike = (usr_id, rev_id, done) => {
  let query_string = 'DELETE FROM coffida_liked WHERE liked_user_id=? AND liked_review_id=?';
  let values = [usr_id, rev_id];

  db.get_pool().query(query_string,
      values,
      function(err, results){
          done(err);
      }
  );
}



const deleteAllReviewLikes = (rev_id, done) => {
  let query_string = 'DELETE FROM coffida_liked WHERE liked_review_id=?';
  let values = [rev_id];


  db.get_pool().query(query_string,
      values,
      function(err, results){
          done(err);
      }
  );
}



module.exports = {
    insert: insert,
    getOne: getOne,
    alter: alter,
    deleteReview: deleteReview,
    addPhoto: addPhoto,
    deletePhotoIfExists: deletePhotoIfExists,
    retreivePhoto: retreivePhoto,
    addReviewLike: addReviewLike,
    deleteReviewLike: deleteReviewLike,
    deleteAllReviewLikes: deleteAllReviewLikes
};
