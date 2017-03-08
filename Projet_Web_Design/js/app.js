/*
===============================================================================================================
|© Copyright de l'entreprise HARP-e fondée par Anthony Prudhomme & Hugo Ruiz								  |
|                                                                                                             |
|"java.js" est l'un des fichiers les plus importants du site internet.										  |
|                                                                                                             |
|C'est lui qui permet de charger la BDD (Base De Données) et de les classer dans des tableaux afin de pouvoir |
|effectuer des opérations. Il permet aussi de charger la page HTML pour créer le lien entre les 2 fichiers.	  |
|                                                                                                             |
|Le fichier est structuré de la manière suivante key: "value", 												  |
|	1. Les variables globales 																				  |
|	2. Modules																								  |
|	3. Les contrôleurs																						  |
|	4. Fonctions																							  |
|	5. Filtres 																								  |
===============================================================================================================
*/

var app = angular.module('videoGames',[
	'ngRoute','chart.js'
]);


//=============================================================================
// Global variables -----------------------------------------------------------
//=============================================================================
var selectedConsoles = [];
var allGamesChart;
var salesByRegionChart;
var radarChart;
var globalFilteredGames;
var mustUpdateChart = false;

var publiNameChoose = "";
var publiFIsEnabled = false;
var dateChosen = "";
var dateCFIsEnable = false;


//=============================================================================
// Module --------------------------------------------------------------------
//=============================================================================

// Module to display differents pages
angular.module('videoGames').config([
	'$routeProvider',
	function($routeProvider){
		$routeProvider
		.when("/videoGamesPage",{ // For the page A
			templateUrl:"partials/videoGamesPage.html" // Upload of page A in the folder
		})
		.otherwise({ // Else
			redirectTo:"videoGamesPage"
		})
	}
]);

//=============================================================================
// Controllers ----------------------------------------------------------------
//=============================================================================

app.controller('videoGamesController',[
	'$http','$scope','$timeout','$window',
	function($http,$scope,$timeout,$window){
		// Upload the data base with video games informations
		var controller = this;
		this.vgDatas = [];
		this.gamesSelected;

		$http.get('datas/video_games_datas.json').success(
			function(result){
				controller.vgDatas = result;

				getInformations(controller.vgDatas, $scope);

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
		  	mustUpdateChart = true;
	  	};

	  	// Called when the user click on a game name
	  	this.onGameClicked = function(newGame){
	  		this.gameSelected = newGame;
	  		updateSalesByRegionChart(this.gameSelected);
	  		updateRadarChart(this.gameSelected);
	  	}

	  	// This function is called every 0,5 seconds to update the filteredGames and display the chart according to its new values
	  	var updateFilteredGames = function() {
        	globalFilteredGames = controller.filteredGames;
        	updateAllGamesChart(globalFilteredGames);
        	$timeout(updateFilteredGames, 2000);
    	}
    	// Initiate the function updateFilteredGames to be calles evere 0,5 seconds
	  	$timeout(updateFilteredGames, 2000);

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
	    $scope.colors = ["#ffffff"];
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

// The chronological filter
app.controller('changeSortBy', function($scope){
	$scope.dateFilterIsEnabled = function(sortBy) {
		// Initialization
		mustUpdateChart = true;
		$scope.sortByDate = sortBy;
		$scope.dateFIsEnabled = false;
		$scope.dateFIsReverse = false;

		if ($scope.sortByDate.indexOf("-Dates") !== -1) {
			$scope.dateFIsEnabled = true;
			$scope.dateFIsReverse = true;
		} else if ($scope.sortByDate.indexOf("+Dates") !== -1) {
			$scope.dateFIsEnabled = true;
			$scope.dateFIsReverse = false;
		}
	}
	
});

// Controller to transmit the publisher chose by the user
app.controller('changePublisherName', function($scope){
	$scope.changePublisher = function(indexPubliChoose) {
		if (indexPubliChoose.indexOf("All") !== -1) { // If the user don't want choose one publisher but all
			publiFIsEnabled = false;
		} else {
			publiFIsEnabled = true;

			publiNameChoose = allPublisher[indexPubliChoose];
		}
	}
});

// Controller to transmit the date chose by the user
app.controller('changeDateYear', function($scope){
	$scope.changeDate = function(indexDate) {
		if (indexDate.indexOf("All") !== -1) { // If the user don't want choose one publisher but all
			dateCFIsEnable = false;
		} else {
			dateCFIsEnable = true;

			yearChosen = allDates[indexDate];
		}
	}
});

app.controller("DoughnutCtrl", function ($scope) {
	$scope.$on('chart-create', function (event, chart) {
    	salesByRegionChart = chart;
	});
	$scope.labels = ["NA Sales","EU Sales", "Japan Sales", "Other Sales"];
	$scope.doughnutData = [1, 1, 1, 1];
	$scope.options = {
    	tooltips: {
	    	callbacks: {
	    		// Define how data should be shown when the user hovers a dot of the chart
                label: function(tooltipItems, data) { 
                    return data.labels[tooltipItems.index] + ": "+ data.datasets[0].data[tooltipItems.index] + "M";
                }
            }
        }
    }
});

app.controller("RadarCtrl", function ($scope) {
	$scope.$on('chart-create', function (event, chart) {
    	radarChart = chart;
    	radarChart.scale.min = 0;
    	radarChart.scale.min = 100;
	});
	$scope.labels =["Score", "Global Sales", "NA Sales", "EU Sales", "JP Sales", "Other Sales", "Recency"];

	$scope.data = [
	[10, 10, 10, 10, 10, 10, 10]
	];
		
	
});

//=============================================================================
// Functions ------------------------------------------------------------------
//=============================================================================

function getInformations(vgDatas, $scope){
	// --- Recuperation of publisher's names ---
	allPublisher = [];
	allPublisher.push({Name: vgDatas[0].Publisher});

	for (var i = 0; i < vgDatas.length; i++) {
		alreadyExist = false;
		
		for (var j = 0; j < allPublisher.length; j++) {
			if (allPublisher[j].Name.indexOf(vgDatas[i].Publisher) !== -1) {
				alreadyExist =  true;
			}
		}

		if (alreadyExist == false) {
			allPublisher.push({Name: vgDatas[i].Publisher});
		}
	}

	allPublisher.sort(function(a, b){
	    if(a.Name < b.Name) return -1;
	    if(a.Name > b.Name) return 1;
	    return 0;
	})

	$scope.allPublisher = allPublisher;
	// -----------------------------------------

	// ----- Recuperation of release date ------
	allDates = [];
	newAllDates = [];
	allDates.push({Year: vgDatas[0].Release_year});

	for (var i = 0; i < vgDatas.length; i++) {
		alreadyExist = false;
		
		for (var j = 0; j < allDates.length; j++) {
			if (allDates[j].Year == vgDatas[i].Release_year) {
				alreadyExist =  true;
			}
		}

		if (alreadyExist == false) {
			allDates.push({Year: vgDatas[i].Release_year});
		}
	}

	allDates.sort(function(a, b){
	    if(a.Year > b.Year) return -1;
	    if(a.Year < b.Year) return 1;
	    return 0;
	})

	$scope.allDates = allDates;
	// -----------------------------------------
}

// Once a new game is selected, this function will be called and the chart showing the sales by region will be updated
function updateSalesByRegionChart(gameSelected){
	salesByRegionChart.data.datasets[0].data[0] = gameSelected.NA_Sales;
	salesByRegionChart.data.datasets[0].data[1] = gameSelected.EU_Sales;
	salesByRegionChart.data.datasets[0].data[2] = gameSelected.JP_Sales;
	salesByRegionChart.data.datasets[0].data[3] = gameSelected.Other_Sales;
	salesByRegionChart.update();
}

// Once a new game is selected, this function will be called and the chart showing the different features of the game will be updated
function updateRadarChart(gameSelected){
	// Every value must have it's maximum to 100 so each value is modified

	// For the score we just multiply it by 10
	radarChart.data.datasets[0].data[0] = gameSelected.Score*10;
	// For the global sales we look if it is less than 20 millions, if not it get 100
	if(gameSelected.Global_Sales < 20){
		radarChart.data.datasets[0].data[1] = gameSelected.Global_Sales/0.2;
	}else{
		radarChart.data.datasets[0].data[1] = 100;
	}
	// For each other sales we do the same as for global sales
	if(gameSelected.NA_Sales < 5){
		radarChart.data.datasets[0].data[2] = gameSelected.NA_Sales/0.05;
	}else{
		radarChart.data.datasets[0].data[2] = 100;
	}
	if(gameSelected.EU_Sales < 5){
		radarChart.data.datasets[0].data[3] = gameSelected.EU_Sales/0.05;
	}else{
		radarChart.data.datasets[0].data[3] = 100;
	}
	if(gameSelected.JP_Sales < 5){
		radarChart.data.datasets[0].data[4] = gameSelected.JP_Sales/0.05;
	}else{
		radarChart.data.datasets[0].data[4] = 100;
	}
	if(gameSelected.Other_Sales < 5){
		radarChart.data.datasets[0].data[5] = gameSelected.Other_Sales/0.05;
	}else{
		radarChart.data.datasets[0].data[5] = 100;
	}
	// For the release year we apply a special formula where the most recent game get 100 and the less recent get less than 100
	radarChart.data.datasets[0].data[6] = 100 - ((2016 - gameSelected.Release_year)*5);
	radarChart.update();
}

// This function update the allGamesChart with the new liste of games (with filters etc.)
function updateAllGamesChart(newListOfGames){
	if(allGamesChart.data.datasets[0].data.length != newListOfGames.length || mustUpdateChart){
		mustUpdateChart = false;
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
				for(var i = 0; i < input_values.length; i++){
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

// Filter to show only the selected publisher
app.filter('publisherFilter', function(){
	return function(input_values, $scope) {
		if (publiFIsEnabled == true) {
			if(typeof(input_values) != "undefined"){
				if(typeof(input_values) == "object"){
					var output_values = [];

					//For each game, check if it's console is contained in the selected console list
					for(var i = 0; i < input_values.length; i++){
						if(publiNameChoose != ""){
							if(input_values[i].Publisher.indexOf(publiNameChoose.Name) !== -1){
								output_values.push(input_values[i]);
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
		} else {
			return input_values;
		}
	}
});

// Filter to show only the selected date
app.filter('dateFilter', function(){
	return function(input_values, $scope) {
		if (dateCFIsEnable == true) {
			if(typeof(input_values) != "undefined"){
				if(typeof(input_values) == "object"){
					var output_values = [];

					//For each game, check if it's console is contained in the selected console list
					for(var i = 0; i < input_values.length; i++){
						if(yearChosen != ""){
							if(input_values[i].Release_year == yearChosen.Year){
								output_values.push(input_values[i]);
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
		} else {
			return input_values;
		}
	}
});
