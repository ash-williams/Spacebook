const convict = require('convict');


let config = convict({
    version: {
      format: String,
      default: '1.0.0'
    },
    specification:{
      format: String,
      default: 'zedrem-Spacebook-1.0.0-swagger.json'
    },
    authToken: {
        format: String,
        default: 'X-Authorization'
    },
    db: {
        host: { // host, rather than hostname, as mysql connection string uses 'host'
            format: String,
            default: process.env.DB_HOST
        },
        port: {
            format: Number,
            default: process.env.DB_PORT
        },
        user: {
            format: String,
            default: process.env.DB_USER
        },
        password: {
            format: String,
            default: process.env.DB_PASS
        },
        database: {
            format: String,
            default: process.env.DB_USER
        },
        multipleStatements:{
            format: Boolean,
            default: true
        }
    }
});


module.exports = config;
