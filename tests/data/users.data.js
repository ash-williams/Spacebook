/*
 This file contains test data for testing users

 Note 1: the intention is that the JSON data is loaded into a global data structure that is then available for each of the test files
 userid and token will need to be updated depending on the results from the GETs and POSTs.

 Note 2: there are two exports. One exports 'good data' (data that should enable a successful creation of a users) and one exports 'bad data' (data intended to cause a 4xx or 5xx)
 */
'use strict';

exports.usersGoodData = function () {
    return [
        {
            "testDescription" : "Create user1, Emma Smith.",
            "givenName": "Emma",
            "familyName": "Smith",
            "email": "emma.smith@example.com",
            "password": "user1123",
            "userid": 0, // get the userId when the user is created and store this
            "token" : "" // maintain a variable for token authorisation
        },
        {
            "testDescription" : "Create user2, Olivia Jones.",
            "givenName": "Olivia",
            "familyName": "Jones",
            "email": "oliva.jones@example.com",
            "password": "user2123",
            "userid": 0, // get the userId when the user is created and store this
            "token" : "" // maintain a variable for token authorisation
        },
        {
            "testDescription" : "Create user3, Sophia Williams.",
            "givenName": "Sophia",
            "familyName": "Williams",
            "email": "sophia.williams@example.com",
            "password": "user3123",
            "userid": 0, // get the userId when the user is created and store this
            "token" : "" // maintain a variable for token authorisation
        },
        {
            "testDescription" : "Create user4, Isabella Brown.",
            "givenName": "Isabella",
            "familyName": "Brown",
            "email": "isabella.brown@example.com",
            "password": "user4123",
            "userid": 0, // get the userId when the user is created and store this
            "token" : "" // maintain a variable for token authorisation
        },
        {
            "testDescription" : "Create user5, Emily Davies.",
            "givenName": "Emily",
            "familyName": "Davies",
            "email": "Emily@Davies.com",
            "password": "user5123",
            "userid": 0, // get the userId when the user is created and store this
            "token" : "" // maintain a variable for token authorisation
        }
    ]
};

exports.usersBadData = function () {
    return [
        {
            /*
             Given names derived from top female names in the States
             Family names derived from most common surnames (in the States?)
             */

            // For testing bad email address
            "testDescription" : "Test for malformed email address on user11.",
            "givenName": "Emily",
            "familyName": "Evans",
            "email": "emily.evans.userexample.com",
            "password": "string123",
            "userid": 0, // get the userId when the user is created and store this
            "token" : "" // maintain a variable for token authorisation
        },
        {
            // For testing duplicate email address (as user1)
            "testDescription" : "Test for duplicate email address on user1.",
            "givenName": "Emma",
            "familyName": "Smith",
            "email": "emma.smith@example.com",
            "password": "user1123",
            "userid": 0, // get the userId when the user is created and store this
            "token" : "" // maintain a variable for token authorisation
        },
        {
            // For testing no/empty password
            "testDescription" : "Test for empty password on user11.",
            "givenName": "Emily",
            "familyName": "string",
            "email": "emily.davies@example.com",
            "password": "",
            "userid": 0, // get the userId when the user is created and store this
            "token" : "" // maintain a variable for token authorisation
        }
    ]
};
