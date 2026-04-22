CREATE TABLE utilisateurs(
    id_utilisateurs SERIAL PRIMARY KEY
    nom VARCHAR (100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    nom_utilisateur VARCHAR(50),
    email VARCHAR(255) NOT NULL
    mot_de_passe VARCHAR(255) NOT NULL,
    date_de_naissance DATE,
    sexe VARCHAR(10) CHECK (sexe IN ('M', 'F','')),
    role VARCHAR(20) NOT NULL CHECK (role IN ("admin","utilisateur")),
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE administrateurs(
    id_administrateur SERIAL PRIMARY KEY,
    id_utilisateurs INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_utilisateur_admin FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id_utilisateurs) ON DELETE CASCADE
);

CREATE TABLE utilisateur(
    id_utilisateur SERIAL PRIMARY KEY,
    id_utilisateurs INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_utilisateur FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id_utilisateurs) ON DELETE CASCADE
);

CREATE TABLE articles(
    id_article SERIAL PRIMARY KEY,
    id_utilisateur INTEGER NOT NULL,
    titre VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    contenu TEXT NOT NULL,
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_utilisateur_article FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateurs) ON DELETE CASCADE
);   

CREATE TABLE commentaires(
    id_commentaire SERIAL PRIMARY KEY,
    id_article INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    contenu TEXT NOT NULL,
    date_commentaire TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_article FOREIGN KEY (id_article) REFERENCES articles(id_article) ON DELETE CASCADE,
    CONSTRAINT fk_utilisateur_commentaire FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateurs) ON DELETE CASCADE
);
    
CREATE TABLE reaction(
    id_reaction SERIAL PRIMARY KEY,
    valeur NOT NULL CHECK (valeur in ('like','dislike')),
    id_article INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    date_like TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_article_like FOREIGN KEY (id_article) REFERENCES articles(id_article) ON DELETE CASCADE,
    CONSTRAINT fk_utilisateur_like FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateurs) ON DELETE CASCADE
);
