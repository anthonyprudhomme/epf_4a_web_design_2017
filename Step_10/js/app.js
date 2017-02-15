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
	'$http',
	function($http){
		console.log("lol");
		this.test1="du texte";

		var controller = this;
		var vgRatesLoaded = false;
		var vgSalesLoaded = false;

		this.allDatas = [];
		

		this.vgRates = [];
		$http.get('datas/vg_rates.json').success(
			function(result){
				controller.vgRates = result;
				vgRatesLoaded = true;
				console.log("Yo2");
				mixDatas();
			}
		);
		this.vgSales = [];
		console.log("lol 2");
		$http.get('datas/vg_sales.json').success(
			function(result){
				controller.vgSales = result;
				vgSalesLoaded = true;
				console.log("Yo");
				mixDatas();
			}
		);

		function mixDatas(){
			console.log(controller.vgRates);
			if(vgSalesLoaded && vgRatesLoaded){
				console.log(controller.vgSales.length);
				//for (var i = 0; i < controller.vgRates.length; i++) {
					//for (var j = 0; j < controller.vgSales.length; j++) {
				for (var i = 0; i < 500; i++) {
					for (var j = 0; j < 500; j++) {
						if(controller.vgSales[i].Name.indexOf(controller.vgRates[i].FIELD3) !== -1){
							console.log("ici:" + i+ " "+controller.vgSales[i].Name + " "+ controller.vgRates[i].FIELD3);
							controller.allDatas.push(controller.vgSales[i]);
							//controller.allDatas[i].rates = controller.vgRates[i];
						}
					}
					//console.log(i);
				}
				console.log(controller.allDatas);
				console.log("done");
			}else{
				console.log("Not loaded yet");
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

