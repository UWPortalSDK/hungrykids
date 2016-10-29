angular.module('portalApp')
.controller('hungrykidsCtrl', ['$scope', '$http', '$q', 'hungrykidsAccessFactory', function ($scope, $http, $q, hungrykidsAccessFactory) {
	// mock data
	$scope.items = [
		{
			title:'Item 1',
			tags: ['tag A', 'tag B', 'tag C'],
			details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
		},
		{
			title:'Item 2',
			tags: ['tag D', 'tag E', 'tag F'],
			details: 'Mauris cursus, sapien et malesuada ultrices, purus sapien iaculis tellus, quis semper magna est at leo.'
		},
		{
			title:'Item 3',
			tags: ['tag A', 'tag H'],
			details: 'Donec id quam eu odio feugiat sagittis. Duis a tempus neque. Praesent elementum quis ante quis commodo. Sed tincidunt aliquet dolor sit amet laoreet. '
		},
		{
			title:'Item 4',
			tags: ['tag I'],
			details: 'Proin sem quam, rutrum id ante id, scelerisque tempor quam. Curabitur pharetra turpis at sem placerat, non vehicula ligula tincidunt.'
		},
		{
			title:'Item 5',
			tags: ['tag C', 'tag K', 'tag B'],
			details: 'Mauris nec ultricies metus. Cras et dictum justo. Nam a ullamcorper dolor. Cras fringilla metus vel facilisis vehicula.'
		},
		{
			title:'Item 6',
			tags: ['tag A', 'tag B', 'tag C'],
			details: 'Curabitur scelerisque lorem risus, in luctus orci hendrerit non. Praesent quis tellus dapibus dolor consectetur volutpat.'
		}
	];
    
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
    
    // Handle form submit in the database test example
    $scope.insertData = function () {
            $scope.portalHelpers.invokeServerFunction('insert', {
                foodname: $scope.insertValue.foodName,
                startdate: $scope.insertValue.startDate,
                enddate: $scope.insertValue.endDate,
                room: $scope.insertValue.room,
                event: $scope.insertValue.event,
                eventurl: $scope.insertValue.eventUrl,
                description: $scope.insertValue.description
            }).then(function (result) {
                $scope.dbData.value = result;
            });
            $scope.insertValue.foodName = "";
            $scope.insertValue.startDate = "";
            $scope.insertValue.endDate = "";
            $scope.insertValue.room = "";
            $scope.insertValue.event = "";
            $scope.insertValue.eventUrl = "";
            $scope.insertValue.description = "";
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