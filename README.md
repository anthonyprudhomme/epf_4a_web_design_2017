								========================================================
								|			Les fonctionnalites implementees		   |
								|			  et celles qui ne le sont pas 			   |
								========================================================
-------------------------------------------------------------------------------------------------------------------------------
|Le site internet contient les directives suivantes :																		  
|	- ng-if, ng-show : Pour afficher davantage d'informations sur les jeux selectionnes par l'utilisateur (voir plus bas)	  
|	- ng-repeat : Pour afficher la liste des jeux filtres																	  
|	- ng-class : Pour changer l'apparence des logos des consoles selectionnes												  
|	- ng-click : Pour selectionner un jeu dans la liste ou l'un des logos de console										  
|	- Nombreux filtres custom : Voir ci-dessous la liste des differents filtres												  
|-----------------------------------------------------------------------------------------------------------------------------
|Le site internet ne contient pas les fonctionnalites suivantes :															  
|	- ng-submit																												  
|-----------------------------------------------------------------------------------------------------------------------------
|Les fonctionnalites bonus que nous avons ajoutees :																		  
|																															  
|	Le site permet de consulter une liste de jeux videos filtrables grâce aux filtres suivants :							  
|		- Filtre par console (en cliquant sur les logos des consoles)														  
|		- Filtre par nom (en entrant le nom du jeu recherche)																  
|		- Filtre par ordre alphabetique (A-Z et Z-A)																		  
|		- Filtre par Meilleures/moins bonnes ventes																			  
|		- Filtre par Meilleures/moins bonnes notes																			  
|		- Filtre par annee de sortie																						  
|		- Filtre par editeur																								  
|		- Filtre par nombre de donnees à afficher dans la liste de jeux videos												  
-------------------------------------------------------------------------------------------------------------------------------

								========================================================
								|		Descriptif du fonctionnement de la page		   |
								========================================================
-------------------------------------------------------------------------------------------------------------------------------
| GRAPHIQUES |																												  
|-------------																												  
|La liste s'actualise en temps reel ainsi qu'un graphique (en bas de la page) qui affiche toutes ces donnees (filtrees) en    
|fonction de leur nombre de vente et de leur note.																			  
|																															  
|Il est possible de cliquer sur les points de ce graphique ou bien sur les noms des jeux pour voir s'afficher de nouvelles	  
|informations :																												  
|	- Un graphique radar indiquant les differentes caracteristiques du jeu (nombre de vente, recence, note)					  
|	- Un diagramme circulaire indiquant les differentes parts de vente en fonction de la region (Amerique du nord, Europe,	  
|	etc.)																													  
|	- Une liste des informations du jeu video avec par exemple son genre, sa date de sortie, ainsi que des liens menant vers  
|	le test du jeu video par le site IGN et un autre menant au site Amazon et ayant dejà effectue la recherche du jeu video   
|	sur la plateforme correspondante.																						  
|																															  
|Les graphiques ont ete realises grâce à la library Angular-chart.js et Chart.js 											  
|-----------------------------------------------------------------------------------------------------------------------------
| MENU |																												  	  
|-------																													  
|Un menu se trouve au sommet de la page peu importe que l'utilisateur soit descendu en bas de la page ou non. Lorsque celui-ci
|clique sur les differents titres, il voit la page defiler jusqu'à la partie choisie.										  
|-----------------------------------------------------------------------------------------------------------------------------
| RESPONSIVE |																												  
|-------------																												  
|Enfin, le site est responsive :																							  
|	- Lorsque l'on reduit la taille de la page, les differents composants de celle-ci se repositionnent de sorte à proposer	  
|	une experience adaptee aux differentes tailles d'ecrans.																  
|	- La taille des polices augmente aussi pour permettre aux utilisateurs de telephones de ne pas avoir à effectuer de zoom  
|	pour voir le contenu de la page.																						  
-------------------------------------------------------------------------------------------------------------------------------

© Copyright de l'entreprise HARP-e fondee par Anthony Prudhomme & Hugo Ruiz