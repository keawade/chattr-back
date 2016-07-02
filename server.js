'use strict'
var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var socketioJwt = require('socketio-jwt')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var dotenv = require('dotenv')
var request = require('request')
var entities = require('html-entities').AllHtmlEntities

var User = require('./models/user')

dotenv.load()

const apiConfig = {
  baseUrl: `https://${process.env.AUTH0_DOMAIN}/api/v2`,
  bearerToken: process.env.API_BEARER_TOKEN
}

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN
};
var port = process.env.PORT || 3000

mongoose.connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@' + process.env.MONGO_ADDRESS + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_NAME)
console.log('[mongo] succesfully connected to mongodb://' + process.env.MONGO_ADDRESS + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_NAME)

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({
  extended: true
}))

// Sockets
io
  .on('connection', socketioJwt.authorize({ // Socket authorization
    secret: Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    timeout: 15000 // 15 seconds to send the authentication message
  })).on('authenticated', function (socket) {
    let userId = entities.decode(JSON.stringify(socket.decoded_token.sub))
    console.log('[auth] socket authenticated:', userId)
    User.findOne({'user_id': userId}, (err, user) => {
      if (err) {
        console.error('[mongo] err:', err)
      }
      if (!user) {
        console.log(`[mongo] did not find user for id: ${userId}`)
        request(`${apiConfig.baseUrl}/users/${userId}`)
          .auth(null, null, true, apiConfig.bearerToken)
          .on('response', (response) => {
            console.log('got response', response.statusCode)
          })
          .on('error', (error) => {
            console.error('error', error)
          })
      } else {
        
      }
    })
    socket.on('room connect', (data) => {

    })
    socket.on('chat message', function (msg) {
      io.emit('chat message', msg);
    });
  })

http.listen(port, function () {
  console.log('listening on *:' + port)
})