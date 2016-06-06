var Room = require('../models/room')

exports.createRoom = function (req, res) {
  var room = new Room()

  room.name = req.body.name
  room.users = []
  room.messages = []

  room.save(function (err) {
    if (err) {
      res.status(500).send(err)
    }
    console.log('[room] created: ' + room)
    res.json({
      message: 'success',
      data: room
    })
  })
}

exports.getRooms = function (req, res) {
  Room.find(function (err, rooms) {
    if (err) {
      res.status(404).send(err)
    }
    console.log('[room] get all rooms')
    res.json({
      message: 'success',
      data: rooms
    })
  })
}

exports.getRoom = function (req, res) {
  Room.findOne(req.params.name, function (err, room) {
    if (err) {
      res.status(500).send(err)
    }
    if (room == null) {
      console.log('[room] failed to get ' + req.params.name + ' room')
      return res.status(404).json({
        message: 'room does not exist'
      })
    }
    console.log('[room] get ' + room.name + ' room')
    res.json({
      message: 'success',
      data: room
    })
  })
}
