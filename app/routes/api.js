var User = require('../models/user'),	//pulls in user.js
	jwt = require('jsonwebtoken'),		//grabs the jsonwebtoken package
	config = require('../../config');
	superSecret = config.secret; 		//supersecret for creating tokens

module.exports = function(app, express) {

	//get an instance of the express router
	var apiRouter = express.Router();

	//authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {
		
		//find the user
		//select the name, username and password explicitly
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user) {
			if (err) throw err;

			//no user with that username was found
			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			} else if (user) {

				//check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Authentication failed. Wrong password.'
					});
				} else {

					//if user is found and password is right
					//create token
					var token = jwt.sign({
						name: user.name,
						username: user.username
					}, superSecret, {
						expiresInMinutes: 1440	//expires in 24 hours
					});

					//return the information including token as JSON
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				}
			}
		});
	});

	//middleware to use for all requests
	//route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		//do logging
		console.log('Somebody just came to our app!');

		//check header or url parameters to post parameters for token
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		//decode token
		if (token) {
			//verifies secret and checks exp
			jwt.verify(token, superSecret, function(err, decoded) {
				if (err) {
					return res.status(403).send({
						success: false,
						message: 'Failed to authenticate token.'
					});
				} else {
					//if everything is good, save request for use in other routes
					req.decoded = decoded;

					next(); //users will only continue with a verified token
				}
			});
		} else {
			//if there is no token
			//return an HTTP response of 403 (access forbidden) and an error message
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}
		//moved next(); to if/else //make sure we go to the next routes and don't stop here
	});

	//test route making sure everything works
	//accessed at Get http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'Hooray! Welcome to our api' });
	});

	//we can have more routes for our api here
	//on routes that end in /users
	apiRouter.route('/users')

		//create a user (accessed at POST http://localhost:8080/api/users)
		.post(function(req, res) {

			//create a new instance of the User model
			var user = new User();

			//set the users information (comes from the request)
			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;

			//save the user and check for errors
			user.save(function(err) {
				if (err){
					//duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'A user with that username already exists.' });
					else
						return res.send(err);
				}

				res.json({ message: 'User created!' })
			});
		})

		//get all users(accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {
			User.find(function(err, users){
				if (err) res.send(err);

				//return the users
				res.json(users);
			});
		});

	//on routes that end in /users/:user_id
	apiRouter.route('/users/:user_id')
		//get the user with that id
		//(accessed at GET http://localhost:8080/api/users/:user_id)
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				//return that user
				res.json(user);
			})
		})

		//update the user with this id
		//(accessed at PUT http://localhost:8080/api/users/:user_id)
		.put(function(req, res) {
			//use our user model to find the user we want
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				//update the users info only if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				//save the user
				user.save(function(err) {
					if (err) res.send(err);

					//return a message
					res.json({ message: 'User updated!' })
				});
			});
		})

		//delete the user with this id
		//(accessed at DELETE http://localhost:8080/api/users/:user_id)
		.delete(function(req, res) {
			if (req.params.user_id !== '56dd72f454c0415b48cb598b')

				User.remove({
					_id: req.params.user_id
				}, function(err, user) {
					if (err) return res.send(err);

					res.json({ message: 'Succefully deleted' });
				});
			else
				res.json({ message: 'Cannot Delete Administrator' });
		})

	//api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});


	return apiRouter; //so as to use it in server.js
};