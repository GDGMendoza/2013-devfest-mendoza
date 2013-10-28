/**
 * Created with JetBrains PhpStorm.
 * User: Claudio
 * Date: 04/10/13
 * Time: 11:16
 * To change this template use File | Settings | File Templates.
 */
//Traemos el modelo de base de datos
var userModel = require('../models/userModel.js');
//Controller de usuarios
var User = {

    //Select 1 user
    getUser: function(req, res) {
        userModel.User.findById(req.param['id'],function (err, user) {
            if(!err) {
                res.json({response:true,user:user});
            } else {
                res.json({err:err});
            }
        });
    },

    //Actualizamos al usuario
    updateUser: function(req, res) {
        if(req.session.user){
            userModel.User.findByIdAndUpdate(req.route.params['id'],
                {
                    username:  req.body.username,
                    email:     req.body.email
                },function(err) {
                    if(!err) {
                        res.json({response:true});
                    } else {
                        res.json({err:err});
                    }
                });
        } else {
            res.json({access:'deny'});
        }
    },

    //Select 1 user
    addUser: function(req, res) {
        var newUser = new userModel.User({
            username:  req.body.username,
            email:     req.body.email,
            password:  req.body.password
        });
        newUser.save(function(err) {
            if(!err) {
                res.json({response:true});
            } else {
                res.json({err:err});
            }
        });
    }
}

//Dejamos accesso desde afuera
exports = module.exports = User;