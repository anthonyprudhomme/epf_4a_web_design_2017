var app = angular.module('store',[
	'ngRoute','chart.js'
]);

var selectedConsoles = [];
var allGamesChart;
var salesByRegionChart;

// Module to display differents pages
angular.module('store').config([
	'$routeProvider',
	function($routeProvider){
		$routeProvider
		.when("/pageA",{ // For the page A
			templateUrl:"partials/pageA.html" // Upload of page A in the folder
		})
		.when("/pageB/:msg",{ // For page B
			templateUrl:"partials/pageB.html", // Upload of page B in the folder
			controller:'pageBController' // The controller of the page B
		})
		.otherwise({ // Else
			redirectTo:"pageA"
		})
	}
]);

// ============== CONTROLLER ==============

// To control the page B
app.controller('pageBController',[
	'$scope',
	'$routeParams',
	function($scope,$routeParams){
		$scope.test1="du texte";
		$scope.message = $routeParams.msg;
	}
]);

app.controller('pageAController',[
	'$http','$scope',
	function($http,$scope){
		// Upload the data base with video games informations
		var controller = this;
		this.gameSelected;

		$http.get('datas/video_games_datas.json').success(
			function(result){
				$scope.vgDatas = result;

				getPublisherName($scope);

				for (var i = 0; i < 7500; i++) {
					var currentData = {x: $scope.vgDatas[i].Global_Sales, y: $scope.vgDatas[i].Score, r: 2, name: $scope.vgDatas[i].Name};
					allGamesChart.data.datasets[0].data[i] = currentData;
				}
				
				// console.log(allGamesChart);
	    		allGamesChart.update();
			}
		);

		// Upload all logos
		$scope.logos = [
			{src:"img/logo_ps1.png",	class:"logo-unselected",name:"PlayStation 1"},
			{src:"img/logo_ps2.png",	class:"logo-unselected",name:"PlayStation 2"},
			{src:"img/logo_ps3.png",	class:"logo-unselected",name:"PlayStation 3"},
			{src:"img/logo_ps4.png",	class:"logo-unselected",name:"PlayStation 4"},
			{src:"img/logo_xbox.png",	class:"logo-unselected",name:"Xbox"},
			{src:"img/logo_x360.png",	class:"logo-unselected",name:"Xbox 360"},
			{src:"img/logo_xone.png",	class:"logo-unselected",name:"Xbox One"},
			{src:"img/logo_psp.png",	class:"logo-unselected",name:"Playstation Portable"},
			{src:"img/logo_psvita.png",	class:"logo-unselected",name:"PlayStation Vita"},
			{src:"img/logo_dc.png",		class:"logo-unselected",name:"Dreamcast"},
			{src:"img/logo_n64.png",	class:"logo-unselected",name:"Nintendo 64"},
			{src:"img/logo_gc.png",		class:"logo-unselected",name:"GameCube"},
			{src:"img/logo_ds.png",		class:"logo-unselected",name:"Nintendo DS"},
			{src:"img/logo_wii.png",	class:"logo-unselected",name:"Wii"},
			{src:"img/logo_wiiu.png",	class:"logo-unselected",name:"Wii U"}
		];
	  	
	  	// To display logos
	  	$scope.changeClass = function(index){
	  		//console.log($scope.logos);

	  		// Unselected -> selected
		    if ($scope.logos[index].class === "logo-unselected") {
		      	$scope.logos[index].class = "logo-selected";
		  		selectedConsoles.push($scope.logos[index]);
		  	} else { // Selected -> unselected
		      	$scope.logos[index].class = "logo-unselected";
		      	var itemIndex = selectedConsoles.indexOf($scope.logos[index]);
		  		if (itemIndex > -1) {
				    selectedConsoles.splice(itemIndex, 1);
				}
		  	}
	  	};

	  	// Called when the user click on a game name
	  	this.onGameClicked = function(gameSelected){
	  		// console.log(gameSelected);
	  		this.gameSelected = gameSelected;
	  		salesByRegionChart.data.datasets[0].data[0] = gameSelected.NA_Sales;
	  		salesByRegionChart.data.datasets[0].data[1] = gameSelected.EU_Sales;
	  		salesByRegionChart.data.datasets[0].data[2] = gameSelected.JP_Sales;
	  		salesByRegionChart.data.datasets[0].data[3] = gameSelected.Other_Sales;
	  		salesByRegionChart.update();
	  	}
	}
]);

app.controller('changeSortBy', function($scope){
	$scope.dateFilterIsEnabled = function(sortBy) {
		// Initialization
		$scope.sortByDate = sortBy;
		$scope.isEnabled = false;
		$scope.isReverse = false;

		console.log("Avant | isEnabled: ", $scope.isEnabled);
		console.log("isReverse: ", $scope.isReverse);

		if ($scope.sortByDate.indexOf("-Dates") !== -1) {
			console.log("Coucou beauté");
			$scope.isEnabled = true;
			$scope.isReverse = true;
		} else if ($scope.sortByDate.indexOf("+Dates") !== -1) {
			console.log("Coucou mocheté");
			$scope.isEnabled = true;
			$scope.isReverse = false;
		}

		console.log("Après | isEnabled: ", $scope.isEnabled);
		console.log("isReverse: ", $scope.isReverse);
	}
});

// Chart controller
app.controller("LineCtrl", function ($scope) {


	$scope.$on('chart-create', function (event, chart) {
    	// console.log(chart);
    	allGamesChart = chart;
	});

	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};
    $scope.series = ['Sales/Score'];
    //Dumb datas
    $scope.data = [
      [{
        x: 1,
        y: 1,
        r: 1
      }]
    ];
    $scope.datasetOverride = [{ xAxisID: 'x-axis-1', yAxisID : 'y-axis-1'}];
    $scope.options = {
    	tooltips: {
	    	callbacks: {
                label: function(tooltipItems, data) { 
                	var gameHovered = data.datasets[0].data[tooltipItems.index];
                    return gameHovered.name + " (" + gameHovered.x +","+gameHovered.y+")";
                }
            }
        },
	    scales: {
	      xAxes: [
	        {
	          id: 'x-axis-1',
	          type: 'logarithmic',
	          display: true,
	          position: 'bottom'
	        }
	      ]
	    }
	};
});

app.controller("DoughnutCtrl", function ($scope) {

	$scope.$on('chart-create', function (event, chart) {
    	// console.log("Region",chart);
    	salesByRegionChart = chart;
	});
	$scope.labels = ["NA Sales","EU Sales", "Japan Sales", "Other Sales"];
	$scope.data = [1, 1, 1, 1];
});

// ============== FUNCTIONS ==============

function getPublisherName($scope){
	// Recuperation of publisher's names
	allPublisher = [];
	allPublisher[0] = $scope.vgDatas[0].Publisher;

	for (var i = 0; i < $scope.vgDatas.length; i++) {
		alreadyExist = false;
		
		for (var j = 0; j < allPublisher.length; j++) {
			if (allPublisher[j].indexOf($scope.vgDatas[i].Publisher) !== -1) {
				alreadyExist =  true;
			}
		}

		if (alreadyExist == false) {
			allPublisher.push($scope.vgDatas[i].Publisher);
		}
	}

	$scope.allPublisher = allPublisher;
}

// ============== FILTERS ==============

app.filter('reverse',function(){
	return function(input_values,toUpperCase){
		if (typeof(input_values) == "string") {
			var output_values = "";

			for(var i=0;i<input_values.length;i++){
				output_values = input_values.charAt(i)+output_values;
			}

			if (toUpperCase) {
				output_values = output_values.toUpperCase();
			}
		} else {
			if(typeof(input_values) != "undefined"){
				if(typeof(input_values) == "object"){
					var output_values = [];

					for(var i = input_values.length-1; i>= 0; i--){
						output_values.push(input_values[i]);
					}
				}
			}else{
				throw("You apply this filter to an undefined object");
			}
		}
		
		return output_values;
	}
});

//Filter function to show only the selected console
app.filter('consoleFilter',function(){
	return function(input_values,$scope){
		if(typeof(input_values) != "undefined"){
			if(typeof(input_values) == "object"){
				var output_values=[];
				
				//For each game, check if it's console is contained in the selected console list
				for(var i=0;i < input_values.length;i++){
					if(selectedConsoles.length != 0){
						for (var j = 0; j < selectedConsoles.length; j++) {
							if(input_values[i].Platform.indexOf(selectedConsoles[j].name) !== -1){
								output_values.push(input_values[i]);
							}
						}
					} else {
						output_values.push(input_values[i]);
					}
				}
			}
		} else {
			throw("You apply this filter to an undefined object");
		}
		
		return output_values;
	}
});

// Filter for date order
app.filter('releaseRecentFilter',function() {
	return function(input_values, $scope, isEnabled, isReverse) {
		if (isEnabled) { // if isEnabled then filter dates
			if (typeof(input_values) != "undefined") { // Verify if the input is known
				if (typeof(input_values) == "object") { // Verify if the input is a list
					var output_values = [];
					
					// For each game
					for(var i = 0; i < input_values.length; i++){
						found = false;

						if (i == 0){ // The first iteration, we initialize the first item of the output table
							output_values.push(input_values[i]);
						}
						for (var j = output_values.length-1; j > -1; j--) {

							if (found == false) {
								if (input_values[i].Release_year > output_values[j].Release_year) { // If the input game is more RECENT than the game in the output table
									// We do nothing because we want the most recent at the top
								} else if (input_values[i].Release_year < output_values[j].Release_year) { // If the input game is more OLD than the game in the output table
									output = output_values;

									for (var k = j; k < output_values.length; k++) {
										output_values[k+1] = output[k];
									}

									output_values[j+1] = input_values[i];

									found = true;
								} else if (input_values[i].Release_year == output_values[j].Release_year) { // If the input game and the game in the output table, they've the same release YEAR
									if (input_values[i].Release_month > output_values[j].Release_month) {
									} else if (input_values[i].Release_month < output_values[j].Release_month) {
										output = output_values;

										for (var k = j; k < output_values.length; k++) {
											output_values[k+1] = output[k];
										}

										output_values[j+1] = input_values[i];
										
										found = true;
									} else if (input_values[i].Release_month == output_values[j].Release_month) { // If the input game and the game in the output table, they've the same release MONTH
										if (input_values[i].Release_day > output_values[j].Release_day) {
										} else { // 2 cases here: more old so it's normal && exactly the same release date so one after one
											output = output_values;

											for (var k = j; k < output_values.length; k++) {
												output_values[k+1] = output[k];
											}

											output_values[j+1] = input_values[i];
											
											found = true;
										}
									}
								}
							}
						}
					}
				} else {
					throw("You apply this filter to an undefined object");
				}
			}
			console.log("Finish");
			return output_values;
		} else { // Otherwise just do not any filter just send input without changes
			return input_values;
		}	
	}
});



