const
  users = require('../models/user.server.models'),
  log = require('../lib/logger')(),
  validator = require('../lib/validator'),
  config = require('../../config/config.js'),
  schema = require('../../config/' + config.get('specification')),
  emailvalidator = require("email-validator");

const photo_tools = require('../lib/photo.tools.js');



const create = (req, res) => {
  if (!validator.isValidSchema(req.body, 'components.schemas.AddUser')) {
        log.warn(`users.controller.create: bad user ${JSON.stringify(req.body)}`);
        log.warn(validator.getLastErrors());
        return res.status(400).send('Bad Request - body must match specification and email must be correct');
    } else {
        let user = Object.assign({}, req.body);

        if(!emailvalidator.validate(user['email']) || user['password'].length <= 5){
            log.warn(`user.controller.create: failed validation ${JSON.stringify(user)}`);
            res.status(400).send('Bad request - email must be valid and password greater than 5 characters');
        }else{
            users.insert(user, function(err, id){
                if (err)
                {
                    log.warn(`user.controller.create: couldn't create ${JSON.stringify(user)}: ${err}`);
                    res.status(400).send('Bad Request - database error. Check the log. Possibly duplicate entry?');
                }else{
                  res.status(201).send({id:id});
                }
            });
        }
    }
}



const login = (req, res) => {
  if(!validator.isValidSchema(req.body, 'components.schemas.LoginUser')){
    log.warn(`users.controller.login: bad request ${JSON.stringify(req.body)}`);
    res.status(400).send('Bad Request - request must match the spec');
  } else{
    let email = req.body.email;
    let password = req.body.password;

    users.authenticate(email, password, function(err, id){
        //console.log(err, id);
        if(err){
            log.warn("Failed to authenticate: " + err);
            res.status(400).send('Invalid email/password supplied');
        } else {
            users.getToken(id, function(err, token){
                /// return existing token if already set (don't modify tokens)
                if (token){
                    return res.send({id: id, token: token});
                } else {
                    // but if not, complete login by creating a token for the user
                    users.setToken(id, function(err, token){
                        res.send({id: id, token: token});
                    });
                }
            });
        }
    });
  }
}



const logout = (req, res) => {
  let token = req.get(config.get('authToken'));
    users.removeToken(token, function(err){
        if (err){
            return res.sendStatus(401);
        }else{
            return res.sendStatus(200);
        }
    });
    return null;
}



const get_one = (req, res) => {
  let id = parseInt(req.params.usr_id);
  if (!validator.isValidId(id)) return res.sendStatus(404);

  users.getOne(id, function(err, results){
      if (err) {
          log.warn(`users.controller.get_one: ${JSON.stringify(err)}`);
          return res.sendStatus(500);
      } else if (!results) {  // no user found
            log.warn(`users.controller.get_one: no results found`);
          return res.sendStatus(404);
      }else{
          res.status(200).json(results);
      }
  });
}



const update = (req, res) => {
    let id = parseInt(req.params.usr_id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    let token = req.get(config.get('authToken'));
    users.getIdFromToken(token, function(err, _id){
        if (_id !== id)
            return res.sendStatus(403);
        if (!validator.isValidSchema(req.body, 'components.schemas.UpdateUser')) {
            log.warn(`users.controller.update: bad user ${JSON.stringify(req.body)}`);
            return res.sendStatus(400);
        }

        users.getJustUser(id, function(err, results){
            if(err) return res.sendStatus(500);
            if (!results) return res.sendStatus(404);  // no user found

            let givenname = '';
            let familyname = '';
            let email = '';
            let password = '';

            if(req.body.hasOwnProperty('first_name')){
                givenname = req.body.first_name;
            }else{
                givenname = results.first_name;
            }

            if(req.body.hasOwnProperty('last_name')){
                familyname = req.body.last_name;
            }else{
                familyname = results.last_name;
            }

            if(req.body.hasOwnProperty('email')){
                email = req.body.email;
            }else{
                email = results.email;
            }

            if(req.body.hasOwnProperty('password')) {
                password = req.body.password;
            }

            if(!emailvalidator.validate(email)){
                res.status(400).send('Invalid email supplied');
            }else{

                let user = {};

                if(password != ''){

                    if(password.length <= 5){
                        return res.status(400).send('Weak password');
                    }

                    user = {
                        "first_name": givenname,
                        "last_name": familyname,
                        "email": email,
                        "password": password
                    }
                }else{
                    user = {
                        "first_name": givenname,
                        "last_name": familyname,
                        "email": email
                    }
                }
                
                users.alter(id, user, function(err){
                    if (err){
                      console.log(err);
                      return res.sendStatus(400);
                    }else{
                      return res.sendStatus(200);
                    }
                });
            }
        });
    });
}

const get_profile_photo = (req, res) => {
    let id = parseInt(req.params.usr_id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    users.getOne(id, async function(err, user){
        if(err){
            return res.sendStatus(500);
        }else if(!user){
            return res.sendStatus(404);
        }else{
            users.retreivePhoto(id, (imageDetails, err) => {
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
    });
}

const add_profile_photo = (req, res) => {
    let id = parseInt(req.params.usr_id);
    if (!validator.isValidId(id)) return res.sendStatus(404);
      
    if(req.header('Content-Type') == 'application/json'){
        res.status(400).send('Bad Request: content type cannot be JSON')
    }
      
    let token = req.get(config.get('authToken'));
    users.getIdFromToken(token, function(err, _id){
        users.getOne(id, async function(err, user){
            if(err){
                return res.sendStatus(500);
            }else if(!user){
                return res.sendStatus(404);
            }else{
                if(_id != user.user_id){
                    return res.sendStatus(403);
                }else{
                    users.deletePhotoIfExists(id, async function(err){
                        if(err){
                            console.log(err);
                            res.sendStatus(500);
                        }else{
                            let image = req;
                            let fileExt = photo_tools.getImageExtension(req.header('Content-Type'));
        
                            if(!fileExt){
                                res.status(400).send('Bad Request: photo must be either image/jpeg or image/png type');
                            }else{
                                try{
                                    await users.addPhoto(image, fileExt, id, function(err){
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



module.exports = {
    create: create,
    login: login,
    logout: logout,
    get_one: get_one,
    update: update,
    get_profile_photo: get_profile_photo,
    add_profile_photo: add_profile_photo
};
