
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

//Usuarios del sistema
var userSchema = new Schema({
    username:       { type: String, required: true, index: { unique: true } },
    email:          { type: String, required: true, index: { unique: true } },
    password:       { type: String, required: true },
    killScore:      { type: Number },
    survivalScore:  { type: Number }
});

var User = mongoose.model('User', userSchema, 'UserModel');
module.exports = User;
