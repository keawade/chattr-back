var mongoose = require('mongoose')

var roomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  users: [String],
  activity: Number,
  messages: [{
    date: String,
    user: String,
    content: String
  }]
})

var room = mongoose.model('room', roomSchema)
module.exports = room
