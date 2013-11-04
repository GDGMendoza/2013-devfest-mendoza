
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

//Usuarios del sistema
var userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true }},
    email:    { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    kills:{type: Number},
    deaths:{type: Number},
    timeAlive:{type: Number}
});

var User = mongoose.model('User', userSchema, 'UserModel');
exports.User = User;
