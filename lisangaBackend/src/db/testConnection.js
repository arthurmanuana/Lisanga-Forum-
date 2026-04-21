import {pool} from './pool.js';
(async()=> {
    try {
        const result = await pool.query('SELECT NOW() AS now, current_database() AS db, version() as version');
        console.log("connexion réussi!");
        console.log("heure du serveur :", result.rows[0].now);
        console.log("base de données :", result.rows[0].db);
        console.log("version :", result.rows[0].version);
    } catch(err) {
        console.error("Erreur lors de la connexion à la base des données: ", err.message);
        process.exit(1);
    } finally{
        await pool.end();
        console.log("connexion terminée");
    }
})();