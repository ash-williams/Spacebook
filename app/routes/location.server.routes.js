const   config = require('../../config/config.js');

const   locations = require('../controllers/location.server.controllers'),
        auth = require('../lib/middleware');

const   version = config.get("version");

module.exports = function(app){

    app.route('/api/' + version + '/location/:loc_id')
        .get(locations.getOne);

    app.route('/api/' + version + '/location/:loc_id/favourite')
        .post(auth.isAuthenticated, locations.addFavourite)
        .delete(auth.isAuthenticated, locations.deleteFavourite);

    app.route('/api/' + version + '/find')
        .get(auth.isAuthenticated, locations.find);

};
