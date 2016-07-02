var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    email: String,
    email_verified: Boolean,
    name: String,
    given_name: String,
    family_name: String,
    picture: String,
    gender: String,
    locale: String,
    updated_at: String,
    user_id: String,
    nickname: String,
    identities: [
        {
            provider: String,
            expires_in: Number,
            user_id: String,
            connection: String,
            isSocial: Boolean
        }
    ],
    created_at: String,
    last_ip: String,
    last_login: String,
    logins_count: Number,
    blocked_for: [String]
})

module.exports = mongoose.model('User', UserSchema)
