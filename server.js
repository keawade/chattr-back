var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var morgan = require('morgan')

var roomController = require('./controllers/room')
var userController = require('./controllers/user')
var authController = require('./controllers/auth')

var config = require('./config')

mongoose.connect('mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + config.mongo.address + ':' + config.mongo.port + '/' + config.mongo.database)
console.log('[mongo] succesfully connected to mongodb://' + config.mongo.address + ':' + config.mongo.port + '/' + config.mongo.database)

var app = express()

var server = require('http').createServer(app)
var io = require('socket.io')(server)

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://chattr-front-react-keawade.c9users.io');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, PATCH');
    next();
});

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({
  extended: true
}))

io.set('origins', '*:*')

console.log('[socket] server listening at ' + config.express.port)
io.on('connection', function (socket) {
  console.log('[socket] user connected')
  socket.on('message', function (message) {
    console.log('[socket] ' + message.username + ' said "' + message.message + '"')
    var newMessage = {
      date: Date.now(),
      user: message.user,
      content: message.content
    }
    io.emit('message', newMessage)
  })
})

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

server.listen(config.express.port)
console.log('[server] running at port ' + config.express.port)
