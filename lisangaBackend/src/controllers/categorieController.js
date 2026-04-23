import { CategorieModel } from '../models/categorieModel.js';

export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategorieModel.getAllCategories();
        return res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Erreur getAllCategories :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des catégories',
        });
    }
};

export const getCategorieById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de la catégorie est invalide",
            });
        }

        const categorie = await CategorieModel.getCategorieById(id);

        if (!categorie) {
            return res.status(404).json({
                success: false,
                message: 'Catégorie introuvable',
            });
        }

        return res.status(200).json({
            success: true,
            data: categorie,
        });
    } catch (error) {
        console.error('Erreur getCategorieById :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la catégorie',
        });
    }
};

export const createCategorie = async (req, res) => {
    try {
        const { nom, description } = req.body;

        if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Le nom de la catégorie est obligatoire',
            });
        }

        if (nom.trim().length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Le nom de la catégorie ne doit pas dépasser 50 caractères',
            });
        }

        const nouvelleCategorie = await CategorieModel.createCategorie({
            nom: nom.trim(),
            description: description?.trim() || null,
        });

        return res.status(201).json({
            success: true,
            message: 'Catégorie créée avec succès',
            data: nouvelleCategorie,
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'Une catégorie avec ce nom existe déjà',
            });
        }

        console.error('Erreur createCategorie :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la catégorie',
        });
    }
};

export const updateCategorie = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nom, description } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de la catégorie est invalide",
            });
        }

        if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Le nom de la catégorie est obligatoire',
            });
        }

        if (nom.trim().length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Le nom de la catégorie ne doit pas dépasser 50 caractères',
            });
        }

        const categorieMaj = await CategorieModel.updateCategorie({
            id_categorie: id,
            nom: nom.trim(),
            description: description?.trim() || null,
        });

        if (!categorieMaj) {
            return res.status(404).json({
                success: false,
                message: 'Catégorie introuvable',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Catégorie mise à jour avec succès',
            data: categorieMaj,
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'Une catégorie avec ce nom existe déjà',
            });
        }

        console.error('Erreur updateCategorie :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de la catégorie',
        });
    }
};

export const deleteCategorie = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de la catégorie est invalide",
            });
        }

        const categorieSupprimee = await CategorieModel.deleteCategorie({
            id_categorie: id,
        });

        if (!categorieSupprimee) {
            return res.status(404).json({
                success: false,
                message: 'Catégorie introuvable',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Catégorie supprimée avec succès',
            data: categorieSupprimee,
        });
    } catch (error) {
        console.error('Erreur deleteCategorie :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la catégorie',
        });
    }
};
