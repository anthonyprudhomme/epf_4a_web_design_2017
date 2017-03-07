/*
==================================================================================================================================
|© Copyright de l'entreprise HARP-e fondée par Anthony Prudhomme & Hugo Ruiz													 |
|																																 |
|"javascript.js" est le fichier contenant les différentes fonctions jquery permettant d'effectuer un scroll vers les différentes |
|parties du site.																												 |
|																																 |
==================================================================================================================================
*/
$(document).ready(function (){
    $("#section1Button").click(function (event){
    	event.preventDefault();
        $('html, body').animate({
            scrollTop: $("#section1").offset().top -50
        }, 500);
    });

    $("#section2Button").click(function (event){
    	event.preventDefault();
        $('html, body').animate({
            scrollTop: $("#section2").offset().top-50
        }, 500);
    });

    $("#section3Button").click(function (event){
    	event.preventDefault();
        $('html, body').animate({
            scrollTop: $("#section3").offset().top-50
        }, 500);
    });

    $("#topButton").click(function (event){
    	event.preventDefault();
    	console.log("top");
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });
});

