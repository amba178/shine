var app = angular.module('customers', []);

app.controller('CustomerSearchController', ['$scope', '$http',
	function ($scope, $http) {
		$scope.search = function(searchTerm) {
			$http.get("/customers.json", 
				     {"params": {"keywords": searchTerm}}
		    ).then(function(response) {
		    	$scope.customers = response.data;
		    }, function(respsone) {
		    	alert(`There was a problem: ${response.status}`);
		    }
		  );
			
		}
	}
]);