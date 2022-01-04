exports.rawParser = function (req, res, next) {
    let data = new Buffer('');
    req.on('data', function (chunk) {
        data = Buffer.concat([data, chunk]);
    });
    req.on('end', function () {
        req.body = data;
        next();
    });
};
