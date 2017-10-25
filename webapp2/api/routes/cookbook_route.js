'use strict';
module.exports = function(app) {
  var cookbook = require('../logic/cookbook.js');
  var passport = require('passport');


  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
  }

  // cookbook Routes
  app.route('/receipe')
    .get(cookbook.list_all_receipe)
    .post(isLoggedIn,cookbook.create_a_receipe);

  // cookbook Routes for special receipe
  app.route('/receipe/:receipeID')
    .get(cookbook.getReceipebyID)
    .post(isLoggedIn,cookbook.getProfile)
    .patch(isLoggedIn, cookbook.update_receipe)
    .delete(isLoggedIn, cookbook.delete_receipe);



 // app.update('/receipe/:receipeID', isLoggedIn, cookbook.update_receipe);

  //
  // app.post('/create', passport.authenticate('local-signup', {
  //   successRedirect : '/create', // redirect to the secure profile section
  //   failureRedirect : '/signup', // redirect back to the signup page if there is an error
  //   failureFlash : true // allow flash messages
  // }));

  app.post('/signup', passport.authenticate('local-signup', {
    // curl will automatically use POST to address the /profile page.
    // how can we redirect to a GET?
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));



  app.post('/login', passport.authenticate('local-login', {
    // same as with signup
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.route('/profile')
    .get(isLoggedIn, cookbook.getProfile)
    .post(isLoggedIn, cookbook.getProfile)

};
