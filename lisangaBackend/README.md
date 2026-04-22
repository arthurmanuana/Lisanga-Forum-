
--configuration du pool postgresql et script de test de connexion à supabase--
le pool est l'objet qui gère les connexions à la base supabase. Toutes les requêtes SQL passeront par lui . c'est le fondement de tout le reste car sans pool qui fonctionne rien d'autre ne marchera.

le pool c'est le gestionnaire qui garde quelques connexions ouvertes en permanence et les recyles. 

dotenv  il lit le fichier .env et rend toutes les variables qu'il contient disponibles dans process.env 

pg est un driver PostgreSQL officiel pour Node.js. il sait parler de protocole PostgreSQL, par exemple ouvrir une connexion TCP vers la base supabase , envoyer des requêtes SQL , recevoir les résulatats. il fournit plusieux classes dont deux principales :
    -client :  une seule connexion , à ouvrir / fermet manuellement.
    -Pool : un gestionnaire qui maintient plusieurs connexions ouvertes et les recyles. c'est ce qu'il faut pour un serveur Expresse qui traite plein des requêtes en parallèle.