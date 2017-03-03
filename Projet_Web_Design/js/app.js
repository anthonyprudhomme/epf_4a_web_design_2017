var app = angular.module('store',[
	'ngRoute','chart.js'
]);

selectedConsoles = [];

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
		this.vgDatas = [];
		$http.get('datas/video_games_datas.json').success(
			function(result){
				controller.vgDatas = result;
			}
		);

		// Upload all logos
		$scope.logos = [
		{src:"img/logo_ps1.png",class:"logo-unselected",name:"PlayStation 1"},
		{src:"img/logo_ps2.png",class:"logo-unselected",name:"PlayStation 2"},
		{src:"img/logo_ps3.png",class:"logo-unselected",name:"PlayStation 3"},
		{src:"img/logo_ps4.png",class:"logo-unselected",name:"PlayStation 4"},
		{src:"img/logo_xbox.png",class:"logo-unselected",name:"Xbox"},
		{src:"img/logo_x360.png",class:"logo-unselected",name:"Xbox 360"},
		{src:"img/logo_xone.png",class:"logo-unselected",name:"Xbox One"},
		{src:"img/logo_psp.png",class:"logo-unselected",name:"Playstation Portable"},
		{src:"img/logo_psvita.png",class:"logo-unselected",name:"PlayStation Vita"},
		{src:"img/logo_dc.png",class:"logo-unselected",name:"Dreamcast"},
		{src:"img/logo_n64.png",class:"logo-unselected",name:"Nintendo 64"},
		{src:"img/logo_gc.png",class:"logo-unselected",name:"GameCube"},
		{src:"img/logo_ds.png",class:"logo-unselected",name:"Nintendo DS"},
		{src:"img/logo_wii.png",class:"logo-unselected",name:"Wii"},
		{src:"img/logo_wiiu.png",class:"logo-unselected",name:"Wii U"}
		];
	  	
	  	// To display logos
	  	$scope.changeClass = function(index){
	  		console.log($scope.logos);
	  		// Unselected -> selected
		    if ($scope.logos[index].class === "logo-unselected"){
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
	  		console.log(gameSelected);
	  		this.gameSelected = gameSelected;
	  	}
	}
]);

app.controller("LineCtrl", function ($scope) {

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };
});

app.filter('reverse',function(){
	return function(input_values,toUpperCase){
		if (typeof(input_values) == "string") {
			var output_values="";
			for(var i=0;i<input_values.length;i++){
				output_values = input_values.charAt(i)+output_values;
			}
			if (toUpperCase) {
				output_values=output_values.toUpperCase();
			}
		}else{
			if(typeof(input_values) != "undefined"){
				if(typeof(input_values) == "object"){
					var output_values=[];
					for(var i=input_values.length-1;i>= 0;i--){
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
					for (var j = 0; j< selectedConsoles.length; j++) {
						if( input_values[i].Platform.indexOf(selectedConsoles[j].name) !== -1){
							output_values.push(input_values[i]);
						}
					}
					}else{
						output_values.push(input_values[i]);
					}
				}
			}
		}else{
			throw("You apply this filter to an undefined object");
		}
		
		return output_values;
	}
});


