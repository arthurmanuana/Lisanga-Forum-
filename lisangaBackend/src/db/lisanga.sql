CREATE TABLE utilisateurs (
    id_utilisateurs SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    nom_utilisateur VARCHAR(50) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_de_naissance DATE,
    sexe VARCHAR(10) CHECK (sexe IN ('M', 'F')),
    role VARCHAR(20) NOT NULL DEFAULT 'utilisateur' CHECK (role IN ('admin','utilisateur')),
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles (
    id_article SERIAL PRIMARY KEY,
    id_utilisateur INTEGER NOT NULL,
    titre VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    contenu TEXT NOT NULL,
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_utilisateur_article FOREIGN KEY (id_utilisateur)
        REFERENCES utilisateurs(id_utilisateurs) ON DELETE CASCADE
);

ALTER TABLE articles ADD COLUMN id_categorie INTEGER NOT NULL;
ALTER TABLE articles ADD CONSTRAINT fk_categories FOREIGN KEY (id_categorie) 
REFERENCES categories(id_categorie) ON DELETE CASCADE;


CREATE TABLE categories (
    id_categorie SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE commentaires (
    id_commentaire SERIAL PRIMARY KEY,
    id_article INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    contenu TEXT NOT NULL,
    date_commentaire TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_article FOREIGN KEY (id_article)
        REFERENCES articles(id_article) ON DELETE CASCADE,
    CONSTRAINT fk_utilisateur_commentaire FOREIGN KEY (id_utilisateur)
        REFERENCES utilisateurs(id_utilisateurs) ON DELETE CASCADE
);

ALTER TABLE commentaires 
ADD COLUMN id_parent_commentaire INTEGER;

FOREIGN KEY (id_parent_commentaire) 
REFERENCES commentaires(id_commentaire) 
ON DELETE CASCADE;

CREATE TABLE reaction (
    id_reaction SERIAL PRIMARY KEY,
    valeur VARCHAR(10) NOT NULL CHECK (valeur IN ('like','dislike')),
    id_article INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    date_like TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_article_like FOREIGN KEY (id_article)
        REFERENCES articles(id_article) ON DELETE CASCADE,
    CONSTRAINT fk_utilisateur_like FOREIGN KEY (id_utilisateur)
        REFERENCES utilisateurs(id_utilisateurs) ON DELETE CASCADE,
    CONSTRAINT unique_reaction UNIQUE (id_article, id_utilisateur)
);

