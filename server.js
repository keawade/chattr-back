var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var socketioJwt = require('socketio-jwt')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var dotenv = require('dotenv')

dotenv.load()

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
    // .on('connection', socketioJwt.authorize({
    //     secret: Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    //     timeout: 15000 // 15 seconds to send the authentication message
    // })).on('authenticated', function (socket) {
      .on('connection', function(socket){
        //console.log('[auth] socket authenticated', JSON.stringify(socket.decoded_token))
        socket.on('chat message', function (msg) {
            io.emit('chat message', msg);
        });
    })

http.listen(port, function(){
  console.log('listening on *:' + port)
})