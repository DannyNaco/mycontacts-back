const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Récupérer le header Authorization (celui qui contient le token)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Accès non autorisé' });
    }

    const token = authHeader.split(' ')[1]; // Récupérer le token sans le Bearer devant la
    const verifToken = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token

    req.user = { id: verifToken.userId , userEmail: verifToken.userEmail }; // on stocke l'id utilisateur dans la requête
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};
