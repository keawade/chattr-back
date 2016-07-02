var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    given_name: String,
    family_name: String,
    picture: String,
    gender: String,
    user_id: String,
    nickname: String,
    last_login: String
})

module.exports = mongoose.model('User', UserSchema)
