const   config = require('../../config/config.js');

const   users = require('../controllers/user.server.controllers'),
        auth = require('../lib/middleware');

const   version = config.get("version");

module.exports = function(app){

    app.route('/api/' + version + '/user')
        .post(users.create);

    app.route('/api/' + version + '/user/login')
        .post(users.login);

    app.route('/api/' + version + '/user/logout')
        .post(auth.isAuthenticated, users.logout);

    app.route('/api/' + version + '/user/:usr_id')
        .get(auth.isAuthenticated, users.get_one)
        .patch(auth.isAuthenticated, users.update);
};
