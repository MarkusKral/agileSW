'use strict';

var mongoose = require('mongoose'),
  Receipe = mongoose.model('Receipe'),
  User = mongoose.model('User');

exports.list_all_receipe= function(req, res) {
  Receipe.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.getReceipebyID = function (req,res){
  Receipe.findById(req.params.receipeID, function(err, receipe) {
    if (err)
      res.send(err);
    res.json(receipe);
  });
};

exports.create_a_receipe = function(req, res) {
  var new_receipe = new Receipe(req.body);
  new_receipe.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.update_receipe = function(req, res) {
  Receipe.findOneAndUpdate({_id: req.params.receipeID}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.delete_receipe = function(req, res) {
  Receipe.remove({
    _id: req.params.receipeID
  }, function(err, receipe) {
    if (err)
      res.send(err);
    res.json({ message: 'Receipe successfully deleted' });
  });
};

// toadd:
// search-method
// update-receipe, check for same user


exports.getProfile = function (req,res){
   res.json(req.user);
};




