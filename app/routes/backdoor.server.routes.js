const   config = require('../../config/config.js');

const   backdoor = require('../controllers/backdoor.server.controllers');

const   version = config.get("version");

module.exports = function(app){

    app.route('/api/' + version + '/reset')
        .post(backdoor.reset);

    app.route('/api/' + version + '/resample')
        .post(backdoor.resample);
    
    app.route('/api/' + version + '/')
        .get((req, res) => { res.send("OK")});
};
