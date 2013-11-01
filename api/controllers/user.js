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
        userModel.User.findById(req.route.params['id'],function (err, user) {
            if(!err) {
                if(user){
                    res.json({response:true,user:user});
                }else{
                    res.json({response:false,user:user});
                }
            } else {
                res.json({response:false,err:err});
            }
        });
    },

    //Actualizamos al usuario
    updateScores: function(req, res) {
        if(req.session.user){
            userModel.User.findByIdAndUpdate(req.route.params['id'],
                {
                    kills:  req.body.kills,
                    deaths:     req.body.deaths,
                    timeAlive:req.body.timeAlive
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
    },

    //Login de usuarios
    login: function(req,res,next){
        userModel.User.findOne({username:req.body.username,password:req.body.password},function (err, user) {
            if(!err) {
                if(user){
                    console.log('USUARIO ENCONTRADO',user);
                    req.session.user = user._id;
                    res.writeHead(303, {Location: req.body.next || '/'});
                    res.end();
                }else{
                    console.log('NO SE ENCONTRO EL USUARIO',user);
                    res.json({response:false,user:user});
                }
            } else {
                console.log('ERROR',user);
                res.json({response:false,err:err});
            }
        });
    }
}

//Dejamos accesso desde afuera
exports = module.exports = User;