// start our angular module and inject userService
angular.module('userCtrl', ['userService'])

	// user controller for the main page
	// inject the User factory
	.controller('userController', function(User) {

		var vm = this;

		// set a processing variable to show loading things
		vm.processing = true;

		// grab all the users at page load
		User.all()
			.success(function(data) {

				// when all the users come back, remove the processing variable
		    	vm.processing = false;

				// bind the users that come back to vm.users
				vm.users = data;
			});

		//function to delete a user
		vm.deleteUser = function(id) {
			vm.processing = true;

			//accepts the user id as a parameter
			User.delete(id)
				.success(function(data) {

					//get all users to update the table
					//you can also set up your api
					//to return the list of users with the delete call
					User.all()
						.success(function(data) {
							vm.processing = false;
							vm.users = data;
						});
				});
		};

		//variable to hide/show elemnts of the view
		//differentiates between create or edit pages
		vm.type = 'create';

		//function to create a user
		vm.saveUser = function() {
			vm.processing = true;
			
			//clear the message
			vm.message = '';

			//use the create function in the userService
			User.create(vm.userData)
				.success(function(data) {
					vm.processing = false;

					//clear the form
					vm.userData = {};
					vm.message = data.message;
				});
		};
	})
