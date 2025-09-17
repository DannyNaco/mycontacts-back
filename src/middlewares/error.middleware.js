module.exports = (err, req, res, next) => {

  const status = err.status || 500;
  const message = err.message || 'Erreur serveur interne';

  res.status(status).json({ error: message });
  
};
