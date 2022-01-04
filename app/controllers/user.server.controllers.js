const
  users = require('../models/user.server.models'),
  log = require('../lib/logger')(),
  validator = require('../lib/validator'),
  config = require('../../config/config.js'),
  schema = require('../../config/' + config.get('specification')),
  emailvalidator = require("email-validator");



const create = (req, res) => {
  if (!validator.isValidSchema(req.body, 'components.schemas.AddUser')) {
        log.warn(`users.controller.create: bad user ${JSON.stringify(req.body)}`);
        log.warn(validator.getLastErrors());
        return res.sendStatus(400);
    } else {
        let user = Object.assign({}, req.body);

        if(!emailvalidator.validate(user['email']) || user['password'].length <= 5){
            log.warn(`user.controller.create: failed validation ${JSON.stringify(user)}`);
            res.status(400).send('Bad Request');
        }else{
            users.insert(user, function(err, id){
                if (err)
                {
                    log.warn(`user.controller.create: couldn't create ${JSON.stringify(user)}: ${err}`);
                    res.status(400).send('Bad Request');
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
    res.status(400).send('Bad Request');
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

    console.log("valid id")

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



module.exports = {
    create: create,
    login: login,
    logout: logout,
    get_one: get_one,
    update: update
};
