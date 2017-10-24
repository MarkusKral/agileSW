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

var mongourl = 'mongodb://cookbook:12345678@localhost:27017/cookbookTest';
var receipe = require('../../wit/webapp2/api/models/cookbook_model.js');
mongoose.connect(mongourl);
var db = mongoose.connection;
var Receipe = require('../../wit/webapp2/api/models/cookbook_model.js');
var User = require('../../wit/webapp2/api/models/user.js');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../wit/webapp2/server');
var expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);

// test with authentication
var request = require('supertest');

// require lodash for some maping features.
var _ = require('lodash');

// Custom vars and functions
var id = '59e9f960ff8b42eb0ed4bc51';
var no_id = '59e9f960ff8b42eb0ed4bb51';


/**
 * set-up the test-user for functions that need authentication.
 */

// object with a hashed password.
var userObject = {
  "password": "$2a$08$O4j2dmJWjqUPdiJtQ/oBUe0CCcUXoi5TiIIZKVJtwnXc68aiAXn7y",
  "email": "test@testing.com",
  "__v": 0
};

var userCredentials = {
  email: 'test@testing.com',
  password: 'login'
};

var authenticatedUser = request.agent(server);

before(function (done) {
  User.remove({}, function (err, user) {
    var user = new User(userObject);
    user.save(function (err, user) {
      if (err)
        console.log(err);
    });
    authenticatedUser
      .post('/login')
      .send(userCredentials)
      .end(function (err, response) {
        expect(response.statusCode).to.equal(302);
        done();
      });
  });
});


// a receipe to test updating/creating
const updateReceipe = {
  "name": "updated",
  "ingredients": {
    "flour": 2.0
  }
};


describe('Testing receipes.', function () {
  beforeEach(function (done) {
    // drop the collection and generate 2 new receips
    mongoose.connection.db.dropCollection('receipe', function (err, result) {
      var rec1 = new Receipe({_id: id, name: "test-receipe", ingredients: {egg: 12, salt: 2}});
      var rec2 = new Receipe({name: "test-receipe2", ingredients: {salt: 12, flour: 2}});
      rec1.save(function (err, task) {
        if (err)
          console.log(err);
      });
      rec2.save(function (err, task) {
        if (err)
          console.log(err);
      });
    });
    done();
  });
  describe('Get Reciepes -- no authentication needed', function () {
    it('return all the recipes', function (done) {
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
          expect(result).to.deep.include({name: "test-receipe"});
          expect(result).to.deep.include({name: "test-receipe2"});
          done();
        });
    });

    it('should return only one receipe', function (done) {
      chai.request(server)
        .get('/receipe/' + id)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          result = res.body;
          expect(result).to.deep.include({name: "test-receipe"});
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
    })
    ;
    describe('Testing delete-functionality.', function () {
      it('Delete testreceipe', function (done) {
        authenticatedUser
          .delete('/receipe/' + id)
          .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('Object');
            result = res.body;
            expect(result).to.deep.include({message: "Receipe successfully deleted"});
            done()
          });
      });
      it('Delete a wrong id', function (done) {
        authenticatedUser
          .delete('/receipe/' + no_id)
          .set('content-type', 'application/json')
          .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(result).to.deep.include({message: "Receipe successfully deleted"});
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
    describe('Testing create-functionality.', function () {
      it('Create a receipe', function (done) {
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
            expect(res.body).to.deep.include({
              message: "Receipe validation failed: ingredients: " +
              "A receipe needs ingredients."
            });
            done();
          });
      });
    });
  });
});
