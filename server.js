var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var io = require('socket.io')(8081)

var roomController = require('./controllers/room')
var userController = require('./controllers/user')
var authController = require('./controllers/auth')

var config = require('./config')

mongoose.connect('mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + config.mongo.address + ':' + config.mongo.port + '/' + config.mongo.database)
console.log('[mongo] succesfully connected to mongodb://' + config.mongo.address + ':' + config.mongo.port + '/' + config.mongo.database)

var app = express()

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({
  extended: true
}))

console.log('[socket] listening on port 8081')
io.on('connection', function (socket) {
  socket.on('connected', onConnect)
  socket.on('message', onMessage)
})

function onConnect (data) {
  console.log('[socket] user connected')
}

function onMessage (data) {
  var message = {
    date: Date.now(),
    user: data.user,
    content: data.content
  }
  console.log('[socket] message sent')
  io.emit('message', message)
}

var router = express.Router()

router.route('/room')
  .post(authController.isAuthenticated, roomController.createRoom)
  .get(authController.isAuthenticated, roomController.getRooms)

router.route('/room/:name')
  .get(authController.isAuthenticated, roomController.getRoom)

router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers)

router.route('/auth')
  .get(authController.isAuthenticated, userController.isAuthenticated)

router.route('/')
  .get(function (req, res) {
    res.send('API is working.')
  })

app.use('/api', router)

app.listen(config.express.port)
console.log('[server] running at port ' + config.express.port)
