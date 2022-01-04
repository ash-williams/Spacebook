const   config = require('../../config/config.js');

const   reviews = require('../controllers/review.server.controllers'),
        auth = require('../lib/middleware');

const   version = config.get("version");

module.exports = function(app){

    app.route('/api/' + version + '/location/:loc_id/review')
        .post(auth.isAuthenticated, reviews.create);

    app.route('/api/' + version + '/location/:loc_id/review/:rev_id')
        .patch(auth.isAuthenticated, reviews.update)
        .delete(auth.isAuthenticated, reviews.deleteReview);

    app.route('/api/' + version + '/location/:loc_id/review/:rev_id/photo')
        .get(reviews.getPhoto)
        .post(auth.isAuthenticated, reviews.addPhoto)
        .delete(auth.isAuthenticated, reviews.deletePhoto);

    app.route('/api/' + version + '/location/:loc_id/review/:rev_id/like')
        .post(auth.isAuthenticated, reviews.addLike)
        .delete(auth.isAuthenticated, reviews.deleteLike);

};
