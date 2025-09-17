require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

const app = require('./app');

const mongoose = require('mongoose');




mongoose.connect(DB_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err));

const db = mongoose.connection;
db.on('error', (error) => console.error('Erreur de connexion à la base de données:', error));


try {
    app.listen(PORT, () => {
        console.log('Le serveur est lancé sur le port', PORT, 'http://localhost:3000/');
        
    });
    } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
}
  