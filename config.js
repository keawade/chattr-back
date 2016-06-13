var config = {}

config.express = {}
config.express.address = process.env.ADDRESS || 'localhost'
config.express.port = process.env.PORT || 3000

config.mongo = {}
config.mongo.address = process.env.mongoaddress
config.mongo.port = process.env.mongoport
config.mongo.database = process.env.mongodbname
config.mongo.username = process.env.mongouser
config.mongo.password = process.env.mongopassword

module.exports = config
