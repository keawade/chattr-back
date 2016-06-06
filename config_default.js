var config = {}

config.express = {}
config.express.address = 'process.env.ADDRESS || localhost'
config.express.port = process.env.PORT || 3000

config.mongo = {}
config.mongo.address = 'localhost'
config.mongo.port = '27017'
config.mongo.database = 'chattr'
config.mongo.username = ''
config.mongo.password = ''

module.exports = config
