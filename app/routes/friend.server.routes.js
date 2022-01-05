const   config = require('../../config/config.js');

const   friends = require('../controllers/friend.server.controllers'),
        auth = require('../lib/middleware');

const   version = config.get("version");

module.exports = function(app){

    app.route('/api/' + version + '/user/:usr_id/friends')
        .get(auth.isAuthenticated, friends.get_list_of_friends)
        .post(auth.isAuthenticated, friends.add_new_friend);

    app.route('/api/' + version + '/friendrequests')
        .get(auth.isAuthenticated, friends.get_outstanding_requests);
    
    app.route('/api/' + version + '/friendrequests/:usr_id')
        .post(auth.isAuthenticated, friends.accept_friend_request)
        .delete(auth.isAuthenticated, friends.delete_friend_request);
    
    app.route('/api/' + version + '/search')
        .get(auth.isAuthenticated, friends.search_users);
};