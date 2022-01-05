const db = require('../../config/db');

/**
 * get the list of friends for a given user id
 */
const get_list = (id, done) => {
    if (id === undefined || id === null)
        return done(true, null);
    else {
        let query = 'SELECT user_id, user_givenname, user_familyname, user_email FROM spacebook_users ';
        query += 'WHERE user_id IN (SELECT friend_friend_id FROM spacebook_friends WHERE friend_user_id=' + id + ' AND status="CONFIRMED")';
        query += 'OR user_id IN (SELECT friend_user_id FROM spacebook_friends WHERE friend_friend_id=' + id + ' AND status="CONFIRMED")';

        db.get_pool().query(
            query,
            function(err, result){
                if(err) return done(err, null);

                return done(null, result);
            }
        )
    }
};

const check_is_friend = (user_id, friend_id, done) => {
    if (user_id === undefined || user_id === null || friend_id === undefined || friend_id === null)
        return done(true, null);
    else {
        let query = 'SELECT friend_user_id FROM spacebook_friends WHERE ((friend_friend_id=' + user_id + ' AND friend_user_id=' + friend_id + ')';
        query += ' OR (friend_friend_id=' + friend_id + ' AND friend_user_id=' + user_id + ')) AND status="CONFIRMED"';

        db.get_pool().query(
            query,
            function(err, result){
                if(err) return done(err, null);

                console.log(result, result.length);
                if(result != null && result.length > 0){
                    return done(null, true);
                }else{
                    return done(null, false);
                }
            }
        )
    }
}

const check_request_submitted = (user_id, friend_id, done) => {
    if (user_id === undefined || user_id === null || friend_id === undefined || friend_id === null)
        return done(true, null);
    else {
        let query = 'SELECT friend_user_id FROM spacebook_friends WHERE ((friend_friend_id=' + user_id + ' AND friend_user_id=' + friend_id + ')';
        query += ' OR (friend_friend_id=' + friend_id + ' AND friend_user_id=' + user_id + '))';

        db.get_pool().query(
            query,
            function(err, result){
                if(err) return done(err, null);

                if(result != null && result.length > 0){
                    return done(null, true);
                }else{
                    return done(null, false);
                }
            }
        )
    }
}


const add_friend = (user_id, friend_id, done) => {
    if (user_id === undefined || user_id === null || friend_id === undefined || friend_id === null){
        return done("Invalid Parameters", null);
    }

    let query = 'INSERT INTO spacebook_friends (friend_user_id, friend_friend_id, status) VALUES (' + user_id + ',' + friend_id + ',"REQUESTED")';

    db.get_pool().query(
        query,
        function(err, result){
            if(err) return done(err, null);

            return done(null, result);
        }
    )
}

const get_friend_requests = (user_id, done) => {
    if (user_id === undefined || user_id === null){
        return done("Invalid Parameters", null);
    }

    let query = 'SELECT u.user_id, u.user_givenname AS first_name, u.user_familyname AS last_name, u.user_email AS email ';
    query += 'FROM spacebook_users u WHERE u.user_id IN ';
    query += '(SELECT friend_user_id FROM spacebook_friends WHERE friend_friend_id=' + user_id + ' AND status="REQUESTED")';

    db.get_pool().query(
        query,
        function(err, result){
            if(err) return done(err, null);
            return done(null, result);         
        }
    )
}

const accept_friend_request = (user_id, friend_id, done) => {
    if (user_id === undefined || user_id === null || friend_id === undefined || friend_id === null){
        return done("Invalid Parameters", null);
    }

    let query = 'UPDATE spacebook_friends SET status="CONFIRMED" WHERE friend_user_id=' + friend_id + ' AND friend_friend_id=' + user_id + ' AND status="REQUESTED"';

    db.get_pool().query(
        query,
        function(err, result){
            if(err) return done(err);
            return done(null);         
        }
    )
}

const delete_friend_request = (user_id, friend_id, done) => {
    if (user_id === undefined || user_id === null || friend_id === undefined || friend_id === null){
        return done("Invalid Parameters", null);
    }

    let query = 'DELETE FROM spacebook_friends WHERE friend_user_id=' + friend_id + ' AND friend_friend_id=' + user_id + ' AND status="REQUESTED"';

    db.get_pool().query(
        query,
        function(err, result){
            if(err) return done(err);
            return done(null);         
        }
    )
}

const search_users = (params, user_id, done) => {
    let query = 'SELECT u.user_id, u.user_givenname, u.user_familyname, u.user_email FROM spacebook_users u ';

    if(params.q){
        query += "WHERE u.user_givenname LIKE '%" + params.q + "%' OR u.user_familyname LIKE '%" + params.q + "%' OR u.user_email LIKE '%" + params.q + "%' ";
    }

    query += "GROUP BY u.user_id "

    if(params.search_in === "friends"){
        query += 'HAVING u.user_id IN (SELECT f.friend_user_id FROM spacebook_friends f WHERE f.friend_friend_id=' + user_id + ' AND f.status="CONFIRMED" UNION SELECT f.friend_friend_id FROM spacebook_friends f WHERE f.friend_user_id=' + user_id + ' AND f.status="CONFIRMED") '
    }

    if(params.limit && params.limit >= 1 && params.limit <= 100){
        query += "LIMIT " + params.limit + " ";
    }else{
        query += "LIMIT 20 ";
    }
    
    if(params.offset && params.offset >= 0){
        query += "OFFSET " + params.offset + " ";
    }else{
        query += "OFFSET 0 ";
    }

    db.get_pool().query(
        query,
        async function(err, users){
            if(err){
                console.log(err);
                return done(err, false);
            }else if(users.length ==0){
                console.log("empty");
                return done(err, []);
            }else{
                return done(null, users);
            }
        }
    );
    
}


module.exports = {
    get_list: get_list,
    add_friend: add_friend,
    check_is_friend: check_is_friend,
    check_request_submitted: check_request_submitted,
    get_friend_requests: get_friend_requests,
    accept_friend_request: accept_friend_request,
    delete_friend_request: delete_friend_request,
    search_users: search_users
}