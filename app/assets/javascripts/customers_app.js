var app = angular.module('customers', ['ngRoute', 'templates', 
	'ngResource', 'ngMessages','ui.bootstrap']);
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		controller: "CustomerSearchController",
		templateUrl: "customer_search.html"
	}).when('/:id', { 
		controller: "CustomerDetailController", 
		templateUrl: "customer_detail.html"
	});

 }
]);


app.controller("CustomerCreditCardController", ["$scope", "$resource", 
	  		function($scope, $resource) {
	  			var CreditCardInfo = $resource('/fake_billing.json')
	  			$scope.setCardholderId = function(cardholderId) {
	  			 $scope.creditCard = CreditCardInfo.get(
	  			 	{"cardholder_id": cardholderId}
	  			  )
	  			}
	  		}
	]);

app.controller('CustomerDetailController', ['$scope','$http','$routeParams','$resource', 
	"$uibModal", function ($scope, $http, $routeParams, $resource, $uibModal) {
		$scope.customer_id = $routeParams.id;
		var Customer = $resource('/customers/:customerId.json', 
		{"customerId": "@customer_id"},{"save": {"method": "PUT"}});
		$scope.customer = Customer.get({"customerId": $scope.customer_id})
		// alert("Ajax Call Initiated!");

		$scope.deactivate = function() {
			var modalInstance = $uibModal.open({ 
				templateUrl: 'confirm_deactivate.html',
				$controller: 'ConfirmDeactivateController'
			});

			modalInstance.result.then(function() {
				$scope.alert = 
				{ 
					type: "success",
				     message: "Customer deactivated"  
				 }  
				},
				 function(reason) {  
					$scope.alert = {   
						type: "warning",
					     message: "Customer still active"
					}
				});
		};
		
		$scope.save = function() {
			if($scope.form.$valid){
				$scope.customer.$save(function() {
					$scope.form.$setPristine();
					$scope.form.$setUntouched();
					$scope.alert = {
						type: "success",
						message: "Customer successfully saved."
					};

				}, function() {
					$scope.alert = {
						type: "danger",
						message: "Customer couldn't be saved."
					};
				}
			  );
			}
		}
		$scope.zipRex = /(^\d{5}$)|(^\d{5}-\d{4}$)/
		$scope.emailRex = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
		$scope.checkboxModel = false;
		$scope.closeAlert = function(index) {
			$scope.alert = undefined;
		}
		// if($scope.checkboxModel){
		// 	alert("checkbox set to true");
		// }
	}

]);

app.controller("ConfirmDeactivateController", ["$scope", "$modalInstance",
	function($scope, $modalInstance) {  
	    alert(" I am in the confirm controller"); 
		$scope.deactivate = function() { 
			$modalInstance.close();  
		};
		$scope.nevermind = function() {
			$modalInstance.dismiss('cancel');
		}
	}
	])


app.controller('CustomerSearchController', ['$scope', '$http','$location',
	function ($scope, $http, $location) {
		var page = 0;

		$scope.customers = [];
		$scope.search = function(searchTerm) {
			if( searchTerm.length < 3) {
				return;
			}
			
			$http.get("/customers.json", {"params": {"keywords": searchTerm,
				       "page": page}}
		    ).then(function(response) {
		    	$scope.customers = response.data;
		    }, function(response) {
		    	alert(`There was a problem: ${response.status}`);
		    }
		  );
			
		}

		$scope.previousPage = function() {
			if(page > 0) {
				page = page - 1;
				$scope.search($scope.keywords);
			}
		}

		$scope.nextPage = function() {
			page = page + 1;
			$scope.search($scope.keywords);
		}

		$scope.viewDetails = function(customer) {
			$location.path('/' + customer.id);

		}
	}
]);