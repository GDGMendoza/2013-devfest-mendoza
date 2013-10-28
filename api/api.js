/**
 * API
 */

module.exports = function(app){ //login gestionado por acá

    var user = require('./controllers/user.js');
    console.log(user);

	app.get('/api/user/:id', user.getUser);

	app.get('/api/cheatscore/:id', function(req, res){
		res.json({
			harcoded: 'json'
		});		
	});

	app.post('/api/cheatscore', function(req, res){
		res.json({
			list: [{harcoded: 'json'}]
		});		
	});

	app.put('/api/cheatscore/:id', function(req, res){
		res.json({
			list: [{harcoded: 'json'}]
		});		
	});

	app.del('/api/cheatscore/:id', function(req, res){
		res.json({
			list: [{harcoded: 'json'}]
		});		
	});

}