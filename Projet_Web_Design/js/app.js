var app = angular.module('videoGames',[
	'ngRoute','chart.js'
]);


//=============================================================================
// Global variables -----------------------------------------------------------
//=============================================================================

var selectedConsoles = [];
var allGamesChart;
var salesByRegionChart;
var globalFilteredGames;

// Module to display differents pages
angular.module('videoGames').config([
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

//=============================================================================
// Controllers ----------------------------------------------------------------
//=============================================================================

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
	'$http','$scope','$timeout','$window',
	function($http,$scope,$timeout,$window){
		// Upload the data base with video games informations
		var controller = this;
		this.vgDatas = [];
		this.gamesSelected;

		$http.get('datas/video_games_datas.json').success(
			function(result){
				controller.vgDatas = result;

				getPublisherName(controller.vgDatas, $scope);

				// Once dates are loaded we update the allGamesChart with all these datas
				updateAllGamesChart(controller.vgDatas);
			}
		);

		// Upload all logos
		$scope.logos = [
			{src:"img/logo_ps1.png",	class:"logo-unselected",name:"PlayStation 1"},
			{src:"img/logo_ps2.png",	class:"logo-unselected",name:"PlayStation 2"},
			{src:"img/logo_ps3.png",	class:"logo-unselected",name:"PlayStation 3"},
			{src:"img/logo_ps4.png",	class:"logo-unselected",name:"PlayStation 4"},
			{src:"img/logo_psp.png",	class:"logo-unselected",name:"Playstation Portable"},
			{src:"img/logo_psvita.png",	class:"logo-unselected",name:"PlayStation Vita"},
			{src:"img/logo_xbox.png",	class:"logo-unselected",name:"Xbox"},
			{src:"img/logo_x360.png",	class:"logo-unselected",name:"Xbox 360"},
			{src:"img/logo_xone.png",	class:"logo-unselected",name:"Xbox One"},
			{src:"img/logo_dc.png",		class:"logo-unselected",name:"Dreamcast"},
			{src:"img/logo_n64.png",	class:"logo-unselected",name:"Nintendo 64"},
			{src:"img/logo_gc.png",		class:"logo-unselected",name:"GameCube"},
			{src:"img/logo_ds.png",		class:"logo-unselected",name:"Nintendo DS"},
			{src:"img/logo_wii.png",	class:"logo-unselected",name:"Wii"},
			{src:"img/logo_wiiu.png",	class:"logo-unselected",name:"Wii U"},
			{src:"img/logo_pc.png",		class:"logo-unselected",name:"PC"}
		];
	  	
	  	// To display logos
	  	$scope.changeClass = function(index){

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
	  	this.onGameClicked = function(newGame){
	  		this.gameSelected = newGame;
	  		updateSalesByRegionChart(this.gameSelected);
	  	}

	  	// This function is called every 0,5 seconds to update the filteredGames and display the chart according to its new values
	  	var updateFilteredGames = function() {
        	globalFilteredGames = controller.filteredGames;
        	updateAllGamesChart(globalFilteredGames);
        	$timeout(updateFilteredGames, 500);
    	}
    	// Initiate the function updateFilteredGames to be calles evere 0,5 seconds
	  	$timeout(updateFilteredGames, 500);

	  	// ----------- Chart part -----------

	  	// This is executed when the chart is created. 
	  	$scope.$on('chart-create', function (event, chart) {
	    	allGamesChart = chart;
		});

		$scope.onClick = function (points, evt) {
			// Change the game selected when the user click on a dot of the chart
			controller.onGameClicked(globalFilteredGames[points[0]._index]);
		};
	    $scope.series = ['Global Series'];
	    //Dumb datas
	    $scope.data = [
	      [{
	        x: 1,
	        y: 1,
	        r: 1
	      }]
	    ];
	    //Set name x-to axis in order to change its display type (linear to logarithmic)
	    $scope.datasetOverride = [{ xAxisID: 'x-axis-1'}];
	    $scope.options = {
	    	tooltips: {
		    	callbacks: {
		    		// Define how date should be shown when the user hovers a dot of the chart
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
		          position: 'bottom',
		          scaleLabel: {
		          	display : true,
		          	labelString: "Sales (in millions)",
		          	fontColor: "white"
		          },
		          ticks: {
                        fontColor: "white",
                        stepSize: 1,
                        beginAtZero:true
                    }
		        }
		      ],
		      yAxes : [
			    {
		          scaleLabel: {
			       	display : true,
			      	labelString: "Score",
			      	fontColor: "white"
			      },
			      ticks: {
                        fontColor: "white",
                        stepSize: 1,
                        beginAtZero:true
                    }
			    }
		      ]
		    }
		};

		// ----------- End of Chart part -----------
	}
]);

app.controller('changeSortBy', function($scope){
	$scope.dateFilterIsEnabled = function(sortBy) {
		// Initialization
		$scope.sortByDate = sortBy;
		$scope.isEnabled = false;
		$scope.isReverse = false;

		if ($scope.sortByDate.indexOf("-Dates") !== -1) {
			$scope.isEnabled = true;
			$scope.isReverse = true;
		} else if ($scope.sortByDate.indexOf("+Dates") !== -1) {
			$scope.isEnabled = true;
			$scope.isReverse = false;
		}
	}
});

app.controller("DoughnutCtrl", function ($scope) {

	$scope.$on('chart-create', function (event, chart) {
    	salesByRegionChart = chart;
	});
	$scope.labels = ["NA Sales","EU Sales", "Japan Sales", "Other Sales"];
	$scope.doughnutData = [1, 1, 1, 1];
});

//=============================================================================
// Functions ------------------------------------------------------------------
//=============================================================================

function getPublisherName(vgDatas, $scope){
	// Recuperation of publisher's names
	allPublisher = [];
	allPublisher[0] = vgDatas[0].Publisher;

	for (var i = 0; i < vgDatas.length; i++) {
		alreadyExist = false;
		
		for (var j = 0; j < allPublisher.length; j++) {
			if (allPublisher[j].indexOf(vgDatas[i].Publisher) !== -1) {
				alreadyExist =  true;
			}
		}

		if (alreadyExist == false) {
			allPublisher.push(vgDatas[i].Publisher);
		}
	}

	$scope.allPublisher = allPublisher;
}

// Once a new game is selected, this function will be called and the chart showing the sales by region will be updated
function updateSalesByRegionChart(gameSelected){
	salesByRegionChart.data.datasets[0].data[0] = gameSelected.NA_Sales;
	salesByRegionChart.data.datasets[0].data[1] = gameSelected.EU_Sales;
	salesByRegionChart.data.datasets[0].data[2] = gameSelected.JP_Sales;
	salesByRegionChart.data.datasets[0].data[3] = gameSelected.Other_Sales;
	salesByRegionChart.update();
}

// This function update the allGamesChart with the new liste of games (with filters etc.)
function updateAllGamesChart(newListOfGames){
	//MUST FIX SOMETHING HERE !!!
	if(allGamesChart.data.datasets[0].data.length != newListOfGames.length){
		allGamesChart.data.datasets[0].data = [];
		for (var i = 0; i < newListOfGames.length; i++) {
			var currentData = {
				x : newListOfGames[i].Global_Sales,
			 	y : newListOfGames[i].Score,
			  	r : 2, 
			  	name:newListOfGames[i].Name, 
			  	console:newListOfGames[i].Platform
			};
			allGamesChart.data.datasets[0].data[i] = currentData;
		}
		allGamesChart.update();
	}
}

//=============================================================================
// Filters --------------------------------------------------------------------
//=============================================================================

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



