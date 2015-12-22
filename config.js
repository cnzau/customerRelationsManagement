module.exports = {
	'port' : process.env.PORT || 8080,		//sets our app's port
	'database' : 'mongodb://p_user:Re9U9e@ds027835.mongolab.com:27835/mobwebz',
	'secret' : 'iloveprogrammingliving'	//a secret string to create tokens with
};

//connect to DB
//var localDb = 'mongodb://localhost:27017/crm',
//	remoteDb = 'mongodb://p_user:Re9U9e@ds027835.mongolab.com:27835/mobwebz';
