var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var morgan = require('morgan')

// Check if running on Heroku
if (!(process.env.NODE && ~process.env.NODE.indexOf('heroku'))) {
  var env = require('node-env-file')
  env('.env')
}

var config = require('./config')
var app = express()
var server = require('http').createServer(app)

mongoose.connect('mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + config.mongo.address + ':' + config.mongo.port + '/' + config.mongo.database)
console.log('[mongo] succesfully connected to mongodb://' + config.mongo.address + ':' + config.mongo.port + '/' + config.mongo.database)

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({
  extended: true
}))

// Sockets
var socket = require('socket.io').listen(app)
require('socketio-auth')(io, {
  authenticate: function (socket, data, callback) {
    // get credentials from client
    var username: data.username
    var password: data.password

    mongoose.findUser('User', {username: usernae}, function(err, user) {
      // wtf is findUser here for?
      // Inform callback of success or fail

      if (err || !user) {
        return callback(new Error('User not found'))
      }
      return callback(null, user.password == password)
    })
  }
})


server.listen(config.express.port)
console.log('[server] running at port ' + config.express.port)
