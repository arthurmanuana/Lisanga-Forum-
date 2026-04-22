import { create, findByEmail, findPublicById, update } from '../models/utilisateurModel.js';
import bcrypt from 'bcryptjs';

const test = async () => {
  console.log('🧪 Test création utilisateur...');
  
  // 1. Hash du mot de passe (toujours fait dans le controller, pas dans le model)
  const hashed = await bcrypt.hash('MonSuperMdp123!', 10);
  
  // 2. Création
  const result = await create({
    nom: 'Test',
    prenom: 'Utilisateur',
    email: 'test@example.com',
    nom_utilisateur: 'testuser',
    mot_de_passe: hashed,
    sexe: 'M'
  });
  
  if (result.success) {
    console.log('✅ Utilisateur créé:', result.user.email);
    
    // 3. Lecture publique (safe)
    const profile = await findPublicById(result.user.id_utilisateurs);
    console.log('🔍 Profil public:', profile.nom, profile.email);
    console.log('🔒 mot_de_passe dans profil ?', 'mot_de_passe' in profile); // Doit être false
    
    // 4. Mise à jour
    const updated = await update(result.user.id_utilisateurs, { nom: 'TestModifié' });
    console.log('✏️ Nom mis à jour:', updated.user.nom);
    
  } else {
    console.log('❌ Erreur:', result.error);
  }
  
  // Fermer le pool après les tests
  setTimeout(() => {
    import('../db/pool.js').then(({ pool }) => pool.end());
  }, 1000);
};

test();