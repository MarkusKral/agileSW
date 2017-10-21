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
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var Receipe = require('../../wit/webapp2/api/models/cookbook_model.js');


//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../wit/webapp2/server');
var expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);


var request = require('supertest');

// require lodash for some maping features.
var _ = require('lodash');
var id = '59e9f960ff8b42eb0ed4bc51';
var no_id = '59e9f960ff8b42eb0ed4bb51';



describe('Get Reciepes -- no authentication needed', function () {
  //somehow all Receipe-functions are not working currently.
  // beforeEach(function () {
  //   Receipe.remove({});
  // });
  describe('GET /receipe', function () {
    it('should return all the recipes', function (done) {
      chai.request(server)
        .get('/receipe')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(2);
          var result = _.map(res.body, function (receipe) {
            return {
              name: receipe.name
            }
          });
          expect(result).to.deep.include({name: "newtest1"});
          expect(result).to.deep.include({name: "newtest2"});
          done();
        });
    });
  });
  describe('GET /receipe/<id>', function () {
    it('should return only one receipe', function (done) {
      chai.request(server)
        .get('/receipe/' + id)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          result = res.body;
          expect(result).to.deep.include({name: "newtest1"});
          done();
        });
    });
    it('search for a receipe that is not present', function (done) {
      chai.request(server)
        .get('/receipe/' + no_id)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('null');
          result = res.body;
          done();
        });
    });
    it('search with invalid id', function (done) {
      chai.request(server)
        .get('/receipe/' + '123456')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          result = res.body;
          expect(result).to.deep.include({"name": "CastError"});
          done();
        });
    });
  });
});

/**
 * Tests that need a valid login:
 */

//let's set up the data we need to pass to the login method
const userCredentials = {
  email: 'bla300022@bla.de',
  password: 'login'
};

const updateReceipe = {
  "name": "updated",
  "ingredients": {
    "flour": 2.0
  }
};

//now let's login the user before we run any tests
var authenticatedUser = request.agent(server);

before(function (done) {
  authenticatedUser
    .post('/login')
    .send(userCredentials)
    .end(function (err, response) {
      expect(response.statusCode).to.equal(302);
      done();
    });
});

describe('Functions that need authentication.', function () {
  describe('Testing update-functionality.', function () {
    it('Update testreceipe', function (done) {
      authenticatedUser
        .patch('/receipe/' + id)
        .set('content-type', 'application/json')
        .send(updateReceipe)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          result = res.body;
          expect(result).to.deep.include({_id: id});
          expect(result).to.deep.include({name: "updated"});
          expect(result.ingredients).to.deep.include({flour: 2});
          done()
        });
    });
    it('Update a wrong id', function (done) {
      authenticatedUser
        .patch('/receipe/' + no_id)
        .set('content-type', 'application/json')
        .send(updateReceipe)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('null');
          done()
        });
    });
    it('Update a invalid id', function (done) {
      authenticatedUser
        .patch('/receipe/' + '123456')
        .set('content-type', 'application/json')
        .send(updateReceipe)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          result = res.body;
          expect(result).to.deep.include({"name": "CastError"});
          done();
        });
    });
  });
  describe('Testing delete-functionality.', function () {
    it('Delete testreceipe', function (done) {
      authenticatedUser
        .delete('/receipe/' + id)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          result = res.body;
          expect(result).to.deep.include({message: "Receipe succesfully deleted"});
          done()
        });
    });
    it('Delete a wrong id', function (done) {
      authenticatedUser
        .delete('/receipe/' + no_id)
        .set('content-type', 'application/json')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('null');
          done()
        });
    });
    it('Delete an invalid id', function (done) {
      authenticatedUser
        .patch('/receipe/' + '123456')
        .set('content-type', 'application/json')
        .send(updateReceipe)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          result = res.body;
          expect(result).to.deep.include({"name": "CastError"});
          done();
        });
    });
  });
  describe.only('Testing create-functionality.', function () {
    it( 'Create a receipe', function (done) {
      authenticatedUser
        .post('/receipe/')
        .set('content-type', 'application/json')
        .send(updateReceipe)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          result = res.body;
          expect(result).to.deep.include({name: "updated"});
          expect(result).to.deep.include({ingredients: {flour: 2}});
          done()
        });
    });
    it('Create without a name', function (done) {
      delete updateReceipe['name']
      authenticatedUser
        .post('/receipe/')
        .set('content-type', 'application/json')
        .send(updateReceipe)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          expect(res.body).to.deep.include({message: "Receipe validation failed: name: A receipe needs a name."});
          done()
        });
    });
    it('Create without ingredients', function (done) {
      updateReceipe['name'] = "test";
      delete updateReceipe['ingredients'];
      authenticatedUser
        .post('/receipe/')
        .set('content-type', 'application/json')
        .send(updateReceipe)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          expect(res.body).to.deep.include({message: "Receipe validation failed: ingredients: " +
                                                     "A receipe needs ingredients."});
          done();
        });
    });
  });
});

/*
TODO:
- correct beforeEach-function.
- correct delete-tests.
 */