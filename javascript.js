angular.module('portalApp')
.controller('hungrykidsCtrl', ['$scope', '$http', '$q', 'hungrykidsAccessFactory', function ($scope, $http, $q, hungrykidsAccessFactory) {
    
    // Import variables and functions from service
    $scope.insertValue = hungrykidsAccessFactory.insertValue;
    $scope.loading = hungrykidsAccessFactory.loading;
    $scope.dbData = hungrykidsAccessFactory.dbData;
    
    // initialize the service
    hungrykidsAccessFactory.init($scope);
    
    // watch for changes in the loading variable
    $scope.$watch('loading.value', function () {
        // if loading
        if ($scope.loading.value) {
            // show loading screen in the first column, and don't append it to browser history
            $scope.portalHelpers.showView('loading.html', 1, false);
            // show loading animation in place of menu button
            $scope.portalHelpers.toggleLoading(true);
        } else {
			console.log('showing main');
            $scope.portalHelpers.showView('addFood.html', 1);
            $scope.portalHelpers.toggleLoading(false);
        }
    });
    
    // Create table, invoked by a button press from database test example
    $scope.createTable = function () {
        $scope.portalHelpers.invokeServerFunction('createTable').then(function (result) {
            $scope.dbData.value = [];
        });
    }
    
    $scope.lat="";
    $scope.lon="";
    $scope.addMarker = addMarker;
    
    // Handle form submit in the database test example
    $scope.insertData = function () {
        var dataaa;
        $http.get("http://nominatim.openstreetmap.org/search?q=" + encodeURI($scope.insertValue.location) +"&country=Canada&city=Waterloo&state=Ontario&bounded=1&limit=1&viewboxlbrt=%20-80.565384,43.483367,%20-80.515517,43.458451&format=json&polygon=0&addressdetails=1")
        .then(function(response) {
             console.log(response.data[0].lat);
             $scope.lat=response.data[0].lat;
             console.log(response.data[0].lon);
             $scope.lon=response.data[0].lon;
            dataaa={
                foodname: $scope.insertValue.foodname,
                edatetime: $scope.insertValue.edatetime,
                lat: $scope.lat,
                lon: $scope.lon,
                location: $scope.insertValue.location,
                eventurl: $scope.insertValue.eventurl,
                description: $scope.insertValue.description
            };
             console.log(dataaa);
            $scope.portalHelpers.invokeServerFunction('insert', dataaa).then(function (result) {
                $scope.dbData.value = result;
            });
            $scope.insertValue.foodname = "";
            $scope.insertValue.edatetime = "";
            $scope.insertValue.location = "";
            $scope.insertValue.eventurl = "";
            $scope.insertValue.description = "";
        });
        	
         
            
    };
	
	// This function gets called when user clicks an item in the list
	$scope.addFood = function(item){
		// Make the item that user clicked available to the template
		$scope.detailsItem = item;		
		$scope.portalHelpers.showView('addFood.html', 2);
	}
}])
// Factory maintains the state of the widget
    .factory('hungrykidsAccessFactory', ['$http', '$rootScope', '$filter', '$q', function ($http, $rootScope, $filter, $q) {
        var initialized = {
            value: false
        };

        // Your variable declarations
        var loading = {
            value: true
        };
        var insertValue = {
            value: null
        };

        var dbData = {
            value: null
        };

        var sourcesLoaded = 0;

        var init = function ($scope) {
            if (initialized.value)
                return;
            initialized.value = true;

			console.log('getting data.. ', $scope.portalHelpers,  $scope.portalHelpers.invokeServerFunction);
            // Place your init code here:
            $scope.portalHelpers.invokeServerFunction('getData').then(function (result) {
				console.log('got data: ', result);
                dbData.value = result;
                sourceLoaded();
            });
        }

        function sourceLoaded() {
            sourcesLoaded++;
            if (sourcesLoaded > 0)
                loading.value = false;
        }

        return {
            init: init,
            loading: loading,
            insertValue: insertValue,
            dbData: dbData
        };

    }]);
