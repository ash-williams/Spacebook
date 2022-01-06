const   config = require('../../config/config.js');

const   posts = require('../controllers/post.server.controllers'),
        auth = require('../lib/middleware');

const   version = config.get("version");

module.exports = function(app){

    app.route('/api/' + version + '/user/:usr_id/post')
        .get(auth.isAuthenticated, posts.get_list_of_posts)
        .post(auth.isAuthenticated, posts.add_new_post);

    app.route('/api/' + version + '/user/:usr_id/post/:post_id')
        .get(auth.isAuthenticated, posts.view_single_post)
        .patch(auth.isAuthenticated, posts.update_post)
        .delete(auth.isAuthenticated, posts.delete_post);
    
    app.route('/api/' + version + '/user/:usr_id/post/:post_id/like')
        .post(auth.isAuthenticated, posts.like_post)
        .delete(auth.isAuthenticated, posts.remove_like);
};