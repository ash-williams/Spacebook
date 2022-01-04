/*
 Test the database /reset and /resample endpoints.
 */


const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');
const filename = path.basename(__filename);

// Require the project-specific JavaScript files
const config = require('./config/config.js');

const expect = chai.expect;

chai.use(chaiHttp);

const server_url = config.getProperties().url;
let test_case_count = 0; // count of test cases

describe('Test the database endpoints.', function () {

    // Output filename of test script for cross reference
    before(function(){
        console.log('    [Script: ' + filename + ']')
    });

    /*
     First, reset the database and reload sample data
     */

    it('Should reset the database using /reset', function () {
        return chai.request(server_url)
            .post('/reset')
            .then(function (res) {
                expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            });
    });

    it('Should repopulate the database using /resample', function () {
        return chai.request(server_url)
            .post('/resample')
            .then(function (res) {
                expect(res).to.have.status(201);
            })
            .catch(function (err) {
                throw err;
            });
    });


});
