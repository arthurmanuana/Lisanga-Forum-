le pool est l'objet qui gère les connexions à la base supabase. Toutes les requêtes SQL passeront par lui . c'est le fondement de tout le reste car sans pool qui fonctionne rien d'autre ne marchera.

le pool c'est le gestionnaire qui garde quelques connexions ouvertes en permanence et les recyles. 