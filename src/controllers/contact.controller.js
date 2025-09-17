const User = require('../models/user.model');
const Contact = require('../models/contact.model');
const jwt = require('jsonwebtoken');
const { all } = require('../app');



exports.listContacts = async (req, res) => {
  try {
    const userId = req.user.id; // Récupérer l'ID utilisateur depuis la requête (ajouté par le middleware requireAuth)
    const contacts = await Contact.find({ AjoutPar : userId });

    if (!userId) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ error: 'Vous n\'avez pas encore de contact, ajoutez-en' });
    }

    res.status(200).json(contacts); // Retourner la liste des contacts
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, AjoutPar: req.user.id });
    if (!contact) {
      const err = new Error('Contact non trouvé');
      err.status = 404;
      throw err;
    }
    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};


exports.ajouterContact = async (req, res) => {
    try{
        const { firstName, lastName, phone, anneeNaissance } = req.body;
        const userId = req.user.id;

        const contact = await Contact.create({firstName, lastName, phone, anneeNaissance, AjoutPar: userId}); 
        // ici, c'est mieux d'ajouter direct le AjoutPar dans le controller, car avec un hook dans le model 
        // (comme je voulais le faire de base), ca complique vu que le hook n'a pas accès à la réponse du requireAuth 
        // (qui renvoie l'id user) contrairement au controller 

        res.status(201).json({contact});
    }
    catch(err){
        if (err.code === 11000) { // Erreur de duplication (index unique)
            return res.status(409).json({ error: 'Ce contact existe déjà pour cet utilisateur' });
        }
        res.status(500).json({ error: 'Erreur serveur' });
    }
}


exports.patchContact = async (req, res, next) => {
try {

  if (Object.keys(req.body).length === 0) { // Object est la fonction constructeur native de JS qui fourni des méthodes statiques, keys est une méthode statique qui renvoie un tableau avec les clés de l'objet en paramètre
    const err = new Error("Aucune donnée à mettre à jour");
    err.status = 400;
    throw err;
  }

  const contact = await Contact.findOne({ _id: req.params.id, AjoutPar: req.user.id });
  if (!contact) {
    const err = new Error('Contact non trouvé');
    err.status = 404;
    throw err; //arrête le controlleur et lance le middleware d'erreur
  }

  const allowedUpdates = ['firstName', 'lastName', 'phone', 'anneeNaissance'];

  Object.keys(req.body).forEach(champ => {
    if (allowedUpdates.includes(champ)) {
      contact[champ] = req.body[champ];
    }
    else {
      const err = new Error(`Le champ ${champ} ne peut pas être modifié`);
      err.status = 400;
      throw err;
    }
  });


  await contact.save();
  res.status(200).json(contact);

} catch (err) {

    if (err.code === 11000){
      err.status = 409;
      err.message = "Téléphone déjà utilisé";
    }

    next(err); // envoie l'erreur au middleware
}
} 

exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, AjoutPar: req.user.id });
    
    if (!contact) {
      const err =  new Error('Contact non trouvé');
      err.status = 404;
      throw err;
    }

    res.status(200).json({ message: 'Contact supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};

