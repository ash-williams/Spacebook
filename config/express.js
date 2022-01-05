const config = require('./config.js');
const version = config.get('version');

const
    express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    rawBodyParser = require('../app/lib/rawbodyparser'),
    multer = require('multer');

const allowCrossOriginRequests = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
};

// Determine correct body parser to use
const jsonParser = bodyParser.json();
const rawParser = rawBodyParser.rawParser;
const upload = multer({ limits: { fileSize: '50Mb' } });




const dynamicBodyParser = (req, res, next) => {
  const contentType = req.header('Content-Type') || '';
  if (contentType === 'image/jpeg' || contentType === 'image/png') {
      rawParser(req, res, next);
  } else {
      jsonParser(req, res, next);
  }
}

module.exports = function(){
    const app = express();

    app.use(dynamicBodyParser);

    app.use(allowCrossOriginRequests);

    app.use((req, res, next) => {
        console.log(`##### ${req.method} ${req.path} #####`);
        next();
    });

    app.use(morgan('tiny'));

    app.get('/api/' + version, function(req, res){
        res.status(200).json({"msg": "Server up"});
    });

    require('../app/routes/user.server.routes')(app);
    require('../app/routes/friend.server.routes')(app);

    require('../app/routes/backdoor.server.routes')(app);

    return app;
};
