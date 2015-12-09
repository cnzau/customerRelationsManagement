//Base setup  *************************************************

//Call the packages:
var express = require('express'),			//calls express
	app = express(),						//define our app using express
	bodyParser = require('body-parser'),	//get body-parser
	morgan = require('morgan'),				//used to see requests
	mongoose = require('mongoose'),			//works with our DB
	port = process.env.PORT || 8080;		//sets our app's port

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

//test route making sure everything works
//accessed at Get http://localhost:8080/api
apiRouter.get('/', function(req, res) {
	res.json({ message: 'Hooray! Welcome to our api' });
});

//we can have more routes for our api here

//Register our routes:
//all our routes will be prefixed with /api
app.use('/api', apiRouter);

//Start the server*************************************************
app.listen(port);
console.log('Magic happens on port ' + port);
