/**
 * API
 */

module.exports = function(app){ //login gestionado por acá
    //Manejo de datos del usuario
    var user = require('./controllers/user.js');

    //Informacion de un usuario por su ID
	app.get('/api/user/:id', user.getUser);

    //Actualizacion de scores
    app.post('/api/user/:id', user.updateScores);

    //Registro de nuevo usuario
    app.put('/api/user', user.addUser);

    //Utilizamos este metodo pra realizar el login
    app.get('/api/user/login', user.login);
}