/**
 * API
 */

module.exports = function(app){ //login gestionado por acá
    //Manejo de datos del usuario
    var user = require('./controllers/user.js');

    app.get('/',function(err,res){
        res.json({battlepro:true});
    });

    //OAUTH Verification
    app.get('/login', function(req, res, next) {
        if(req.session.user) {
            res.writeHead(303, {Location: '/'});
            return res.end();
        }
        var next_url = req.query.next ? req.query.next : '/';
        res.end('<html><form method="post" action="/login"><input type="hidden" name="next" value="' + next_url + '"><input type="text" placeholder="username" name="username"><input type="password" placeholder="password" name="password"><button type="submit">Login</button></form>');
    });

    app.post('/login', user.login);

    app.get('/logout', function(req, res, next) {
        req.session.destroy(function(err) {
            res.writeHead(303, {Location: '/'});
            res.end();
        });
    });


    //Informacion de un usuario por su ID
	app.get('/api/user/:id', user.getUser);

    //Actualizacion de scores
    app.post('/api/user/:id', user.updateScores);

    //Registro de nuevo usuario
    app.put('/api/user', user.addUser);

    //Utilizamos este metodo pra realizar el login
    app.get('/api/user/login', user.login);

};