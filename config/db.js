const mysql = require('mysql');

const config = require('./config.js');

let state = {
    pool: null
};

exports.connect = function(done){
    state.pool = mysql.createPool(config.get('db'));
    done();
};

exports.get_pool = function(){
    return state.pool;
};
