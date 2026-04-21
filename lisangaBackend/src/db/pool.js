//chargement de dotenv pour que process.env.DATABASE_URL soit disponible.
import 'dotenv/config';

//importation de pg pour la connexion à la base de données.

import pkg from 'pg';

const { Pool } = pkg;

//creation d'un objet Pool qui gère les connexions à la base de données.

const pool  = new Pool({
    //la chaine de connexion est dans le fichier .env.
    connectionString: process.env.DATABASE_URL,
    //utilisation du ssl pour la connexion à la base de données supabase
    ssl:{ rejectUnauthorized:false},
    //nombre de connexion max que le pool peut maintenir.
    max:30,
    //temps d'attente max pour une connexion inutilisée avant de la fermer.
    idleTimeoutMillis:30000,
});

//gestion des erreurs du pool.
pool.on('error', (err)=> {
    console.error('Erreur intatendue sur une connexion inactive : ', err);
})
//exportation du pool pour que les autres fichiers puissent l'utiliser.

export {pool};