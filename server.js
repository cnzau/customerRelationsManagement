//Base setup  *************************************************

//Call the packages:
var express = require('express'),			//calls express
	app = express(),						//define our app using express
	bodyParser = require('body-parser'),	//get body-parser
	morgan = require('morgan'),				//used to see requests
	mongoose = require('mongoose'),			//works with our DB
	config = require('./config'),			//use config.js file
	User = require('./app/models/user'),	//pulls in user.js
	jwt = require('jsonwebtoken'),			//grabs the jsonwebtoken package
	apiRoutes = require('./app/routes/api')(app, express);
	
//connect to DB local or remote as set in config file
mongoose.connect(config.database);

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

//Register our routes:
//all our routes will be prefixed with /api
app.use('/api', apiRoutes);

//Start the server*************************************************
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
