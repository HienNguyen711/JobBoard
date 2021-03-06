'use strict';
process.env.NODE_ENV = 'test';

var http = require('http');
var request = require('request');
var chai = require('chai');
var mongoose = require('mongoose');
var app = require('../../server');
var userFixture = require('../fixtures/user');
var should = chai.should();
var config = app.get('config');
var baseUrl = config.baseUrl;
var User = mongoose.model('User');
var Contact = mongoose.model('Contact');
var appServer;

//CONtact
describe('Contact', function() {

  before(function(done) {
    appServer = http.createServer(app);//create server 

    appServer.on('listening', function() {//listening the server 
      User.create(userFixture, function(err, user) {
        if (err) throw err;

        // authenticate the user
        request({
          method: 'POST',
          url: baseUrl + '/auth/login',
          form: {
            'email': userFixture.email,
            'password': 'P@ssw0rd!'
          },
          json:true
        }, function(err, res, body) {
          if (err) throw err;

          res.statusCode.should.equal(200);
          done();
        });

      });
    });

    appServer.listen(config.port);
  });

  after(function(done) {
    appServer.on('close', function() {//server is closed 
      done();
    });
    //close mongodb connection 
    mongoose.connection.db.dropDatabase(function(err) {
      if (err) throw err;

      appServer.close();//close the server connection 
    });
  });

  afterEach(function(done){
    Contact.remove({}, function(err) {
      if (err) throw err;

      done();
    });
  });
//create new job
  it('should create a new job', function(done) {
    request({
      method: 'POST',
      url: baseUrl + '/contacts',
      form: {
        'email': 'jane.doe@test.com',
        'name': 'Jane Doe'
      },
      json:true
    }, function(err, res, body) {
      if (err) throw err;

      res.statusCode.should.equal(201);
      body.email.should.equal('jane.doe@test.com');
      body.name.should.equal('Jane Doe');
      done();
    });
  });

});

