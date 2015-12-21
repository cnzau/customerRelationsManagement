//inject ngRoute for all our routing needs
angular.module('routerRoutes', ['ngRoute'])

//configure our routes
.config(function($routeProvider, $locationProvider) {

	$routeProvider

	//route for the homepage
	.when('/', {
		templateUrl : 'views/pages/home.html',
		controller : 'homeController',
		controllerAs: 'home'
	})

	//route for the about page
	.when('/about', {
		templateUrl : 'views/pages/about.html',
		contoller : 'aboutController',
		controllerAs : 'about'
	})

	//route for contact page
	.when('/contact', {
		templateUrl : 'views/pages/contact.html',
		controller : 'contactController',
		controllerAs : 'contact'
	});

	//set our app to have pretty urls
	$locationProvider.html5Mode(true);
});