/**
 * Created with JetBrains PhpStorm.
 * User: Claudio
 * Date: 04/10/13
 * Time: 13:53
 * To change this template use File | Settings | File Templates.
 */
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
