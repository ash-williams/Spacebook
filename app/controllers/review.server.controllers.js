const
  reviews = require('../models/review.server.models'),
  users = require('../models/user.server.models'),
  log = require('../lib/logger')(),
  validator = require('../lib/validator'),
  config = require('../../config/config.js'),
  schema = require('../../config/' + config.get('specification')),
  photo_tools = require('../lib/photo.tools.js');



const create = (req, res) => {
  let loc_id = parseInt(req.params.loc_id);
  if (!validator.isValidId(loc_id)) return res.sendStatus(404);

  let token = req.get(config.get('authToken'));
  users.getIdFromToken(token, function(err, usr_id){
    if (!validator.isValidSchema(req.body, 'components.schemas.AddReview')) {
      log.warn(`reviews.controller.create: bad review ${JSON.stringify(req.body)}`);
      log.warn(validator.getLastErrors());
      return res.sendStatus(400);
    } else {
      let review = Object.assign({}, req.body);

      reviews.insert(review, loc_id, usr_id, function(err, id){
          if (err)
          {
              log.warn(`review.controller.create: couldn't create ${JSON.stringify(review)}: ${err}`);
              if(err.code == 'ER_NO_REFERENCED_ROW_2'){
                res.status(404).send('Not Found');
              }else{
                res.status(400).send('Bad Request');
              }
          }else{
            res.sendStatus(201);
          }
      });
    }
  });
}



const update = (req, res) => {
  let loc_id = parseInt(req.params.loc_id);
  let rev_id = parseInt(req.params.rev_id);
  if (!validator.isValidId(loc_id) || !validator.isValidId(rev_id)) return res.sendStatus(404);

  let token = req.get(config.get('authToken'));
  users.getIdFromToken(token, function(err, _id){
      reviews.getOne(rev_id, function(err, review){
        if(err){
          return res.sendStatus(500);
        }else if(!review){
          return res.sendStatus(404);
        }else{
          if(loc_id != review.location_id){
            return res.sendStatus(403);
          }else if(_id != review.user_id){
            return res.sendStatus(403);
          }else{
            if (!validator.isValidSchema(req.body, 'components.schemas.UpdateReview')) {
                log.warn(`review.controller.update: bad review ${JSON.stringify(req.body)}`);
                return res.sendStatus(400);
            }else{
              let overall_rating = null;
              let price_rating = null;
              let quality_rating = null;
              let clenliness_rating = null;
              let review_body = null;

              if(req.body.hasOwnProperty('overall_rating')){
                overall_rating = req.body.overall_rating;
              }else{
                overall_rating = review.overall_rating;
              }

              if(req.body.hasOwnProperty('price_rating')){
                price_rating = req.body.price_rating;
              }else{
                price_rating = review.price_rating;
              }

              if(req.body.hasOwnProperty('quality_rating')){
                quality_rating = req.body.quality_rating;
              }else{
                quality_rating = review.quality_rating;
              }

              if(req.body.hasOwnProperty('clenliness_rating')){
                clenliness_rating = req.body.clenliness_rating;
              }else{
                clenliness_rating = review.clenliness_rating;
              }

              if(req.body.hasOwnProperty('review_body')){
                review_body = req.body.review_body;
              }else{
                review_body = review.review_body;
              }

              let updated_review = {
                "overall_rating": overall_rating,
                "price_rating": price_rating,
                "quality_rating": quality_rating,
                "clenliness_rating": clenliness_rating,
                "review_body": review_body
              }

              reviews.alter(rev_id, updated_review, function(err){
                  if (err){
                    console.log(err);
                    return res.sendStatus(400);
                  }else{
                    return res.sendStatus(200);
                  }
              });
            }
          }
        }
      });
    });
}



const deleteReview = (req, res) => {
  let loc_id = parseInt(req.params.loc_id);
  let rev_id = parseInt(req.params.rev_id);
  if (!validator.isValidId(loc_id) || !validator.isValidId(rev_id)) return res.sendStatus(404);

  let token = req.get(config.get('authToken'));
  users.getIdFromToken(token, function(err, _id){
      reviews.getOne(rev_id, function(err, review){
        if(err){
          return res.sendStatus(500);
        }else if(!review){
          return res.sendStatus(404);
        }else{
          if(loc_id != review.location_id){
            return res.sendStatus(403);
          }else if(_id != review.user_id){
            return res.sendStatus(403);
          }else{
            reviews.deletePhotoIfExists(rev_id, function(err){
              if(err){
                return res.sendStatus(500);
              }else{
                reviews.deleteAllReviewLikes(rev_id, function(err){
                  if(err){
                    return res.sendStatus(500);
                  }else{
                    reviews.deleteReview(rev_id, function(err){
                        if (err){
                          console.log(err);
                          return res.sendStatus(400);
                        }else{
                          return res.sendStatus(200);
                        }
                    });
                  }
                });
              }
            });

          }
        }
      });
    });
}



const getPhoto = (req, res) => {
  let loc_id = parseInt(req.params.loc_id);
  let rev_id = parseInt(req.params.rev_id);
  if (!validator.isValidId(loc_id) || !validator.isValidId(rev_id)) return res.sendStatus(404);

  reviews.getOne(rev_id, async function(err, review){
    if(err){
      return res.sendStatus(500);
    }else if(!review){
      return res.sendStatus(404);
    }else{
      if(loc_id != review.location_id){
        return res.sendStatus(403);
      }else{
        reviews.retreivePhoto(rev_id, (imageDetails, err) => {
          if(err == "Doesn't exist"){
            return res.sendStatus(404);
          }else if(err){
            return res.sendStatus(500);
          }else{
            return res.status(200)
                      .contentType(imageDetails.mimeType)
                      .send(imageDetails.image);
          }
        });
      }
    }
  });
}



const addPhoto = (req, res) => {
  let loc_id = parseInt(req.params.loc_id);
  let rev_id = parseInt(req.params.rev_id);
  if (!validator.isValidId(loc_id) || !validator.isValidId(rev_id)) return res.sendStatus(404);

  if(req.header('Content-Type') == 'application/json'){
    res.status(400).send('Bad Request: content type cannot be JSON')
  }

  let token = req.get(config.get('authToken'));
  users.getIdFromToken(token, function(err, _id){
      reviews.getOne(rev_id, async function(err, review){
        if(err){
          return res.sendStatus(500);
        }else if(!review){
          return res.sendStatus(404);
        }else{
          if(loc_id != review.location_id){
            return res.sendStatus(403);
          }else if(_id != review.user_id){
            return res.sendStatus(403);
          }else{
            reviews.deletePhotoIfExists(rev_id, async function(err){
              if(err){
                console.log(err);
                return res.sendStatus(500);
              }else{
                let image = req;
                let fileExt = photo_tools.getImageExtension(req.header('Content-Type'));

                if(!fileExt){
                  res.status(400).send('Bad Request: photo must be either image/jpeg or image/png type');
                }else{
                  try{
                    await reviews.addPhoto(image, fileExt, rev_id, function(err){
                      if(err){
                        return res.sendStatus(500);
                      }else{
                        return res.sendStatus(200);
                      }
                    });
                  }catch(err){
                    console.log(err);
                    return res.sendStatus(500);
                  }
                }
              }
            });
          }
        }
      });
    });
}



const deletePhoto = (req, res) => {
  let loc_id = parseInt(req.params.loc_id);
  let rev_id = parseInt(req.params.rev_id);
  if (!validator.isValidId(loc_id) || !validator.isValidId(rev_id)) return res.sendStatus(404);

  if(req.header('Content-Type') == 'application/json'){
    res.status(400).send('Bad Request: content type cannot be JSON')
  }

  let token = req.get(config.get('authToken'));
  users.getIdFromToken(token, function(err, _id){
      reviews.getOne(rev_id, async function(err, review){
        if(err){
          return res.sendStatus(500);
        }else if(!review){
          return res.sendStatus(404);
        }else{
          if(loc_id != review.location_id){
            return res.sendStatus(403);
          }else if(_id != review.user_id){
            return res.sendStatus(403);
          }else{
            reviews.deletePhotoIfExists(rev_id, async function(err){
              if(err){
                console.log(err);
                return res.sendStatus(500);
              }else{
                return res.sendStatus(200);
              }
            });
          }
        }
      });
    });
}



const addLike = (req, res) => {
  let loc_id = parseInt(req.params.loc_id);
  let rev_id = parseInt(req.params.rev_id);
  if (!validator.isValidId(loc_id) || !validator.isValidId(rev_id)) return res.sendStatus(404);

  let token = req.get(config.get('authToken'));
  users.getIdFromToken(token, function(err, _id){
      reviews.getOne(rev_id, async function(err, review){
        if(err){
          return res.sendStatus(500);
        }else if(!review){
          return res.sendStatus(404);
        }else{
          if(loc_id != review.location_id){
            return res.sendStatus(403);
          }else{
            console.log("HERE", _id, rev_id);
            reviews.addReviewLike(_id, rev_id, function(err){
              if(err){
                if(err.code == 'ER_DUP_ENTRY'){
                  return res.sendStatus(200);
                }else{
                  console.log(err);
                  return res.sendStatus(500);
                }
              }else{
                return res.sendStatus(200);
              }
            });
          }
        }
      });
    });
}



const deleteLike = (req, res) => {
  let loc_id = parseInt(req.params.loc_id);
  let rev_id = parseInt(req.params.rev_id);
  if (!validator.isValidId(loc_id) || !validator.isValidId(rev_id)) return res.sendStatus(404);

  let token = req.get(config.get('authToken'));
  users.getIdFromToken(token, function(err, _id){
      reviews.getOne(rev_id, async function(err, review){
        if(err){
          return res.sendStatus(500);
        }else if(!review){
          return res.sendStatus(404);
        }else{
          if(loc_id != review.location_id){
            return res.sendStatus(403);
          }else{
            reviews.deleteReviewLike(_id, rev_id, function(err){
              if(err){
                  console.log(err);
                  return res.sendStatus(500);
              }else{
                return res.sendStatus(200);
              }
            });
          }
        }
      });
    });
}



module.exports = {
    create: create,
    update: update,
    deleteReview: deleteReview,
    getPhoto: getPhoto,
    addPhoto: addPhoto,
    deletePhoto: deletePhoto,
    addLike: addLike,
    deleteLike: deleteLike
};
