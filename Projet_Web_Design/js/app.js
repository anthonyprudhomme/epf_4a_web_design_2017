var app = angular.module('store',[
	'ngRoute'
]);

selectedConsoles = [];

angular.module('store').config([
	'$routeProvider',
	function($routeProvider){
		$routeProvider
		.when("/pageA",{
			templateUrl:"partials/pageA.html"
		})
		.when("/pageB/:msg",{
			templateUrl:"partials/pageB.html",
			controller:'pageBController'
		})
		.otherwise({
			redirectTo:"pageA"
		})
	}
]);

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
		var controller = this;
		this.vgDatas = [];
		$http.get('datas/video_games_datas.json').success(
			function(result){
				controller.vgDatas = result;
				console.log(controller.vgRates);
			}
		);

		$scope.logos = [{src:"img/logo_ps3.png",class:"logo-unselected",name:"PlayStation 3"},{src:"img/logo_xone.png",class:"logo-unselected",name:"Xbox One"}];
	  	
	  	$scope.changeClass = function(index){
	  		console.log($scope.logos);
		    if ($scope.logos[index].class === "logo-unselected"){
		      	$scope.logos[index].class = "logo-selected";
		  		selectedConsoles.push($scope.logos[index]);
		  	}
		    else{
		      	$scope.logos[index].class = "logo-unselected";
		      	var itemIndex = selectedConsoles.indexOf($scope.logos[index]);
		  		if (itemIndex > -1) {
				    selectedConsoles.splice(itemIndex, 1);
				}
		  	}
	  	};
	}
]);

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

app.filter('consoleFilter',function(){
	return function(input_values,$scope){
		console.log(selectedConsoles);
		if(typeof(input_values) != "undefined"){
			if(typeof(input_values) == "object"){
				var output_values=[];
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