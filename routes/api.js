/**
 * API
 */

module.exports = function(app){

	app.get('/api/cheatscore', function(req, res){
		res.json({
			list: [{harcoded: 'json'}]
		});		
	});

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