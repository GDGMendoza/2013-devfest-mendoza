
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

//Usuarios del sistema
var userSchema = new Schema({
    username:       { type: String, required: true, index: { unique: true } },
    email:          { type: String, required: true, index: { unique: true } },
    password:       { type: String, required: true },
    kill_score:     { type: Number },
    survival_score: { type: Number }
});

var User = mongoose.model('User', userSchema, 'UserModel');
exports.User = User;
