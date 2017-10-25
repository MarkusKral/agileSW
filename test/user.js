/**

 This is the file for receipe-tests.

 We need:

 - create (auth needed)
 - show all receipes (without auth)
 - list one receipe (without auth)
 - update receipe (auth needed)
 - delete receipe (auth needed)

 */
//During the test the env variable is set to test
process.env.NODE_ENV = "test";
var mongoose = require("mongoose");

var mongourl = "mongodb://cookbook:12345678@localhost:27017/cookbookTest";
mongoose.connect(mongourl);
var User = require("../webapp2/api/models/user.js");

//Require the dev-dependencies
var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../webapp2/server");
var expect = chai.expect;
chai.use(require("chai-things"));
chai.use(chaiHttp);

// test with authentication
var request = require("supertest");

/**
 * set-up the test-users.
 */

// object with a hashed password.
var userObject = {
    "password": "$2a$08$O4j2dmJWjqUPdiJtQ/oBUe0CCcUXoi5TiIIZKVJtwnXc68aiAXn7y",
    "email": "test@testing.com",
    "__v": 0
};

var userCredentials = {
    email: "test@testing.com",
    password: "login"
};

var newUser = {
    email: "setupUser@testing.com",
    password: "login"
};

/**
 * We need multiple user-objects here, one for the predefined user, one for the new user.
 */
var authenticatedUser = request.agent(server);
var userSetup = request.agent(server);


describe("Testing user and authentication.", function () {
    describe("Test with preset user.", function () {
        it("Login", function (done) {
            User.remove({}, function (err, user) {
                var user = new User(userObject);
                user.save(function (err, user) {
                    if (err)
                        console.log(err);
                });
                authenticatedUser
                    .post("/login")
                    .send(userCredentials)
                    .end(function (err, response) {
                        expect(response.statusCode).to.equal(302);
                        expect(response.request).to.have.property("cookies");
                        expect(response).to.deep.include({text: "Found. Redirecting to /profile"});
                        done();
                    });
            });
        });
    });
    describe("Test with new user.", function () {
        it("signup", function (done) {
            userSetup
                .post("/signup")
                .send(newUser)
                .end(function (err, response) {
                    expect(response.statusCode).to.equal(302);
                    expect(response.request).to.have.property("cookies");
                    expect(response).to.deep.include({text: "Found. Redirecting to /profile"});          done();
                });
        });
        it("Login", function (done) {
            userSetup
                .post("/login")
                .send(newUser)
                .end(function (err, response) {
                    expect(response.statusCode).to.equal(302);
                    expect(response.request).to.have.property("cookies");
                    expect(response).to.deep.include({text: "Found. Redirecting to /profile"});
                    done();
                });
        });
    });
});


