angular.module('userApp', [
	'ngAnimate',		//add animations to all of our angiular directives(ngShow/ngHide)
	'app.routes',		//routing of our app
	'authService',		//service file
	'mainCtrl',			//encompass our main view
	'userCtrl',			//have controllers for all our user management pages
	'userService'		//service file
])
	
	//application configuration to integrate token into requests
	.config(function($httpProvider) {

		//attach our auth interceptor to http requests
		$httpProvider.interceptors.push('AuthInterceptor');
	});