/**
 * API
 */

module.exports = function(app){ //login gestionado por acá
    //Manejo de datos del usuario
    var user = require('./controllers/user.js');

    app.get('/login', function(req, res, next) {
        if(req.session.user) {
            res.writeHead(303, {Location: '/'});
            return res.end();
        }
        var next_url = req.query.next ? req.query.next : '/';
        res.end('<html><form method="post" action="/login"><input type="hidden" name="next" value="' + next_url + '"><input type="text" placeholder="username" name="username"><input type="password" placeholder="password" name="password"><button type="submit">Login</button></form>');
    });

    app.post('/login', function(req, res, next){
        var parametros = {
            username: req.body.username,
            password: req.body.password
        };
        user.login(parametros, function(retorno){
            if(retorno.response){
                req.session.user = retorno.user;//._id
                console.log('sesion ' + req.session.user);
            }
            res.json(retorno);
        });
    });

    app.get('/logout', function(req, res, next) {
        req.session.destroy(function(err) {
            res.writeHead(303, {Location: '/'});
            res.end();
        });
    });


    //Informacion de un usuario por su ID
    app.get('/api/user/:id', function(req, res){
        var parametros = { id: req.route.params['id'] };
        user.getUser(parametros, function(retorno){
            res.json(retorno);
        });
    });

    //Actualizacion de scores
    app.post('/api/user/:id', function(req, res){
        var parametros = {
            id: req.route.params['id'],
            kill_score: req.body.kill_score,
            survival_score: req.body.survival_score
        };
        if(req.session.user){
            user.updateScores(parametros, function(retorno){
                res.json(retorno);
            });
        } else {
            res.json({ response: false, access: 'denied' })
        }
    });

    //Registro de nuevo usuario
    app.put('/api/user', function(req, res){
        var parametros = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        user.addUser(parametros, function(retorno){
            if(retorno.response){
                req.session.user = retorno.user._id;
            }
            res.json(retorno);
        });
    });

};