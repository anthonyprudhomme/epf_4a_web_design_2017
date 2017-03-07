								========================================================
								|			Les fonctionnalités implémentées		   |
								|			  et celles qui ne le sont pas 			   |
								========================================================
-------------------------------------------------------------------------------------------------------------------------------
|Le site internet contient les directives suivantes :																		  |
|	- ng-if, ng-show : Pour afficher davantage d'informations sur les jeux sélectionnés par l'utilisateur (voir plus bas)	  |
|	- ng-repeat : Pour afficher la liste des jeux filtrés																	  |
|	- ng-class : Pour changer l'apparence des logos des consoles sélectionnés												  |
|	- ng-click : Pour sélectionner un jeu dans la liste ou l'un des logos de console										  |
|	- Nombreux filtres custom : Voir ci-dessous la liste des différents filtres												  |
|-----------------------------------------------------------------------------------------------------------------------------|
|Le site internet ne contient pas les fonctionnalités suivantes :															  |
|	- ng-submit																												  |
|-----------------------------------------------------------------------------------------------------------------------------|
|Les fonctionnalités bonus que nous avons ajoutées :																		  |
|																															  |
|	Le site permet de consulter une liste de jeux vidéos filtrables grâce aux filtres suivants :							  |
|		- Filtre par console (en cliquant sur les logos des consoles)														  |
|		- Filtre par nom (en entrant le nom du jeu recherché)																  |
|		- Filtre par ordre alphabétique (A-Z et Z-A)																		  |
|		- Filtre par Meilleures/moins bonnes ventes																			  |
|		- Filtre par Meilleures/moins bonnes notes																			  |
|		- Filtre par année de sortie																						  |
|		- Filtre par éditeur																								  |
|		- Filtre par nombre de données à afficher dans la liste de jeux vidéos												  |
-------------------------------------------------------------------------------------------------------------------------------

								========================================================
								|		Descriptif du fonctionnement de la page		   |
								========================================================
-------------------------------------------------------------------------------------------------------------------------------
| GRAPHIQUES |																												  |
|-------------																												  |
|La liste s'actualise en temps réel ainsi qu'un graphique (en bas de la page) qui affiche toutes ces données (filtrées) en    |
|fonction de leur nombre de vente et de leur note.																			  |
|																															  |
|Il est possible de cliquer sur les points de ce graphique ou bien sur les noms des jeux pour voir s'afficher de nouvelles	  |
|informations :																												  |
|	- Un graphique radar indiquant les différentes caractéristiques du jeu (nombre de vente, récence, note)					  |
|	- Un diagramme circulaire indiquant les différentes parts de vente en fonction de la région (Amérique du nord, Europe,	  |
|	etc.)																													  |
|	- Une liste des informations du jeu vidéo avec par exemple son genre, sa date de sortie, ainsi que des liens menant vers  |
|	le test du jeu vidéo par le site IGN et un autre menant au site Amazon et ayant déjà effectué la recherche du jeu vidéo   |
|	sur la plateforme correspondante.																						  |
|																															  |
|Les graphiques ont été réalisés grâce à la library Angular-chart.js et Chart.js 											  |
|-----------------------------------------------------------------------------------------------------------------------------|
| MENU |																												  	  |
|-------																													  |
|Un menu se trouve au sommet de la page peu importe que l'utilisateur soit descendu en bas de la page ou non. Lorsque celui-ci|
|clique sur les différents titres, il voit la page défiler jusqu'à la partie choisie.										  |
|-----------------------------------------------------------------------------------------------------------------------------|
| RESPONSIVE |																												  |
|-------------																												  |
|Enfin, le site est responsive :																							  |
|	- Lorsque l'on réduit la taille de la page, les différents composants de celle-ci se repositionnent de sorte à proposer	  |
|	une expérience adaptée aux différentes tailles d'écrans.																  |
|	- La taille des polices augmente aussi pour permettre aux utilisateurs de téléphones de ne pas avoir à effectuer de zoom  |
|	pour voir le contenu de la page.																						  |
-------------------------------------------------------------------------------------------------------------------------------

© Copyright de l'entreprise HARP-e fondée par Anthony Prudhomme & Hugo Ruiz