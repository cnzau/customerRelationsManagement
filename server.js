//Base setup  *************************************************

//Call the packages:
var express = require('express'),			//calls express
	app = express(),						//define our app using express
	bodyParser = require('body-parser'),	//get body-parser
	morgan = require('morgan'),				//used to see requests
	mongoose = require('mongoose'),			//works with our DB
	port = process.env.PORT || 8080,		//sets our app's port
	User = require('./app/models/user'),	//pulls in user.js
	jwt = require('jsonwebtoken'),			//grabs the jsonwebtoken package
	superSecret = "iloveprogrammingliving";	//a secret string to create tokens with

//connect to DB
var localDb = 'mongodb://localhost:27017/crm',
	remoteDb = '';
mongoose.connect(localDb);

//App config:
//Use body parser to grab infor' from POST req'
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//conf' our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
	next();
});

//log all req' to the console
app.use(morgan('dev'));

//Routes for our API ********************************************

//basic route(home page)
app.get('/', function(req, res) {
	res.send('Welcome to the home page!');
});

//get an instance of the express router
var apiRouter = express.Router();

//middleware to use for all requests
apiRouter.use(function(req, res, next) {
	//do logging
	console.log('Somebody just came to our app!');
	//this is where to authenticate users
	next(); //make sure we go to the next routes and don't stop here
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

			//update the users info only if its new
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
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err) return res.send(err);

			res.json({ message: 'Succefully deleted' });
		});
	})

//Register our routes:
//all our routes will be prefixed with /api
app.use('/api', apiRouter);

//Start the server*************************************************
app.listen(port);
console.log('Magic happens on port ' + port);
