var User = require('../models/user')

exports.postUsers = function (req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  })

  user.save(function (err) {
    if (err) {
      res.send(err)
    }
    console.log('[user] created user ' + req.body.username)
    res.json({
      message: 'success'
    })
  })
}

exports.getUsers = function (req, res) {
  User.find(function (err, users) {
    if (err) {
      res.send(err)
    }
    res.json({
      message: 'success',
      data: users
    })
  })
}

exports.isAuthenticated = function (req, res) {
  res.json({
    message: 'success',
    data: {
      authenticated: true
    }
  })
}
