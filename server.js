//Base setup  *************************************************

//Call the packages:
var express = require('express'),			//calls express
	app = express(),						//define our app using express
	bodyParser = require('body-parser'),	//get body-parser
	morgan = require('morgan'),				//used to see requests
	mongoose = require('mongoose'),			//works with our DB
	config = require('./config'),			//use config.js file
	path = require('path');					//reqired to pass a HTML file


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
		
//connect to DB local or remote as set in config file
mongoose.connect(config.database);

//set static files location
//used for routes that our frontend will make
app.use(express.static(__dirname + '/public'));

//Register our routes:*********************************************
//all routes to be prefixed with /api****************
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

//Main CatchAll route********************************
//Send users to frontend*****************************
//has to be registered after our routes so as to only catch routes not handled by node
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


//Start the server*************************************************
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
