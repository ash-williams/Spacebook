const   config = require('../../config/config.js');

const   users = require('../controllers/user.server.controllers'),
        auth = require('../lib/middleware');

const   version = config.get("version");

module.exports = function(app){

    app.route('/api/' + version + '/user')
        .post(users.create);

    app.route('/api/' + version + '/login')
        .post(users.login);

    app.route('/api/' + version + '/logout')
        .post(auth.isAuthenticated, users.logout);

    app.route('/api/' + version + '/user/:usr_id')
        .get(auth.isAuthenticated, users.get_one)
        .patch(auth.isAuthenticated, users.update);

    app.route('/api/' + version + '/user/:usr_id/photo')
        .get(auth.isAuthenticated, users.get_profile_photo)
        .post(auth.isAuthenticated, users.add_profile_photo);
    
};
