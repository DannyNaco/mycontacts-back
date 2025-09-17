const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { nomprenom, email, password } = req.body; // Récupérer les données du corps de la requête

    const verifSiExiste = await User.findOne({ email });
    if (verifSiExiste) return res.status(409).json({ error: 'Email déjà existant' });

    // Créer l’utilisateur (password hashé par le pre-save)
    const user = await User.create({ nomprenom, email, password });
    //on peu aussi faire:
    // const user = new User({ nomprenom, email, password });
    // await user.save();

    res.status(201).json(user); // Retourner l’utilisateur créé (sans le mot de passe grâce au toJSON du schéma)

  } catch (err) {
    res.status(500).json({ error: 'Erreur du serveur lors de l\'inscription' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // Récupérer les données du corps de la requête
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Chercher l'utilisateur
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'email introuvable, veuillez vous inscrire' });

    // Vérifier le mot de passe
    const verifMdp = await bcrypt.compare(password, user.password);
    if (!verifMdp) return res.status(401).json({ error: 'Identifiants invalides' });

    // Générer un token
    const token = jwt.sign(
      { userId: user.id, userEmail: user.email }, // ce qu'on veut stocker dans le token              
      process.env.JWT_SECRET,             // clé secrète
      { expiresIn: process.env.JWT_EXPIRES_IN } // durée de vie
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nomprenom: user.nomprenom,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
