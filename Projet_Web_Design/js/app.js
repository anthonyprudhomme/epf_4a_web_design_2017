var app = angular.module('store',[
	'ngRoute'
]);

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

		$scope.logos = [{src:"img/logo_ps3.png",class:"logo-unselected"},{src:"img/logo_xone.png",class:"logo-unselected"}];
	  	$scope.changeClass = function(index){
	  		console.log($scope.logos);

		    if ($scope.logos[index].class === "logo-unselected")
		      $scope.logos[index].class = "logo-selected";
		    else
		      $scope.logos[index].class = "logo-unselected";
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
					for(var i=input_values.length;i> 0;i--){
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
					for(var i=input_values.length-5;i>= 0;i--){
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



