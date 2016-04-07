"use strict";

var controller = require('./controller')({ csrf: true });

controller.get('/', function(req, res) {
  res.locals.paper = {
    spacing: 10,
    color: [ 0, 0, 0, 40 ]
  };

  res.render('home/index');
});

module.exports = controller;
