/**
 * @file createFirstAdmin.js
 * @description Script pour créer le tout premier administrateur
 * @usage: npm run seed:admin
 */

import { pool } from '../src/db/pool.js';
import bcrypt from 'bcryptjs';

const createAdmin = async () => {
  try {
    // 💡 Tu peux modifier ces valeurs ou les mettre dans ton .env
    const email = process.env.INIT_ADMIN_EMAIL || 'admin@lisanga.com';
    const password = process.env.INIT_ADMIN_PASSWORD || 'Password123!';

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role)
      VALUES ('Admin', 'Lisanga', $1, $2, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `;

    await pool.query(query, [email, hashedPassword]);
    console.log('✅ Premier administrateur créé (ou déjà existant).');
  } catch (err) {
    console.error('❌ Échec de la création:', err.message);
  } finally {
    await pool.end(); // Ferme proprement la connexion DB
  }
};

createAdmin();