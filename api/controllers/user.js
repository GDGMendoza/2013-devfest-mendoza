
//Traemos el modelo de base de datos
var userModel = require('../models/userModel.js');

//Controller de usuarios
var User = {
    register: function(params, callback) {
        var newUser = new userModel.User({
            username: params.username,
            email: params.email,
            password: params.password
        });
        newUser.save(function(err, user) {
            if(!err) {
                callback({ response: true, user: user });
            } else {
                callback({ response: false, err: err });
            }
        });
    },
    login: function(params, callback){
        userModel.User.findOne({
            username:params.username,
            password:params.password
        }, function (err, user) {
            if(!err) {
                if(user){
                    callback({ response: true, user: user });
                }else{
                    callback({ response: false, user: user });
                }
            } else {
                callback({ response: false, user: user, err: err });
            }
        });
    },
    updateScores: function(params, callback) {
        userModel.User.findByIdAndUpdate(params.id, {
            kill_score: params.kill_score,
            survival_score: params.survival_score
        }, function(err, user) {
            if(!err) {
                callback({ response: true, user: user });
            } else {
                callback({ response: false, err: err });
            }
        });
    }
};

//Dejamos accesso desde afuera
exports = module.exports = User;