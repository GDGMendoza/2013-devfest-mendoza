
//Traemos el modelo de base de datos
var userModel = require('../models/userModel.js');

//Controller de usuarios
var User = {
    register: function(params, callback) {
        var newUser = new userModel({
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
        userModel.findOne({
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
    updateKillScore: function(params, callback) {
        userModel.findByIdAndUpdate(params.id, {
            killScore: params.killScore
        }, function(err, user) {
            if(!err) {
                callback({ response: true, user: user });
            } else {
                callback({ response: false, err: err });
            }
        });
    },
    updateSurvivalScore: function(params, callback) {
        userModel.findByIdAndUpdate(params.id, {
            survivalScore: params.survivalScore
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