const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Récupérer le header Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Accès non autorisé' });
    }

    const token = authHeader.split(' ')[1]; // Récupérer le token, sans le 'Bearer'
    const verifToken = jwt.verify(token, process.env.JWT_SECRET); // Vérifier le token

    req.user = { id: verifToken.userId , userEmail: verifToken.userEmail }; // on stocke l'id utilisateur dans la requête
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};
