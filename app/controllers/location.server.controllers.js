const
  locations = require('../models/location.server.models'),
  users = require('../models/user.server.models'),
  log = require('../lib/logger')(),
  validator = require('../lib/validator'),
  config = require('../../config/config.js'),
  schema = require('../../config/' + config.get('specification'));



const getOne = (req, res) => {
  let loc_id = parseInt(req.params.loc_id);
  if (!validator.isValidId(loc_id)) return res.sendStatus(404);

  locations.getOne(loc_id, async function(err, location){
    if(err){
      return res.sendStatus(500);
    }else if(!location){
      return res.sendStatus(404);
    }else{
      return res.status(200).send(location);
    }
  });
}



const addFavourite = (req, res) => {
  let loc_id = parseInt(req.params.loc_id);
  if (!validator.isValidId(loc_id)) return res.sendStatus(404);

  let token = req.get(config.get('authToken'));
  users.getIdFromToken(token, function(err, _id){
      locations.getOne(loc_id, async function(err, location){
        if(err){
          return res.sendStatus(500);
        }else if(!location){
          return res.sendStatus(404);
        }else{
          if(loc_id != location.location_id){
            return res.sendStatus(403);
          }else{
            locations.addFavourite(_id, loc_id, function(err){
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



const deleteFavourite = (req, res) => {
  let loc_id = parseInt(req.params.loc_id);
  if (!validator.isValidId(loc_id)) return res.sendStatus(404);

  let token = req.get(config.get('authToken'));
  users.getIdFromToken(token, function(err, _id){
      locations.getOne(loc_id, async function(err, location){
        if(err){
          return res.sendStatus(500);
        }else if(!location){
          return res.sendStatus(404);
        }else{
          if(loc_id != location.location_id){
            return res.sendStatus(403);
          }else{
            locations.deleteFavourite(_id, loc_id, function(err){
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



const find = (req, res) => {
  let params = req.query;

  let token = req.get(config.get('authToken'));
  users.getIdFromToken(token, function(err, _id){
    locations.find(params, _id, function(err, results){
        if(err){
          return res.sendStatus(500);
        }else{
          return res.status(200).send(results);
        }
    });
  });
}



module.exports = {
    getOne: getOne,
    addFavourite: addFavourite,
    deleteFavourite: deleteFavourite,
    find: find
};
