/**
 * API
 */

module.exports = function(app){

    var user = require('./controllers/user.js');

    app.post('/register', function(req, res){
        var parametros = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        user.register(parametros, function(retorno){
            if(retorno.response){
                req.session.user = retorno.user;
            }
            res.json(retorno);
        });
    });

    app.post('/login', function(req, res){
        var parametros = {
            username: req.body.username,
            password: req.body.password
        };
        user.login(parametros, function(retorno){
            if(retorno.response){
                req.session.user = retorno.user;
                console.log('sessionHttp ' + JSON.stringify(req.session));
            }
            res.json(retorno);
        });
    });

    app.get('/logout', function(req, res) {
        req.session.destroy(function(err) {
            if(!err){
                res.json({ response: true });
            } else {
                res.json({ response: false });
            }
        });
    });
};