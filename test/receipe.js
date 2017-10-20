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
//Receipe = mongoose.model('../../wit/webapp2/api/models/cookbook_model.js');

var Receipe = require('../../wit/webapp2/api/models/cookbook_model.js');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../wit/webapp2/server');
var should = chai.should();
var expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
// require lodash for some maping features.
var _ = require('lodash');
var id = '59e9f960ff8b42eb0ed4bc51';
var no_id = '59e9f960ff8b42eb0ed4bb51';


describe('Get Reciepes -- no authentication needed', function () {
  // beforeEach(function () {
  //   Receipe.remove();
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
              // ingredients: receipe.ingredients
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

/*
TODO:
 - push/update/delete method that require authentication
 */