//On importe express
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

//CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000', // pr pouvoir faire les bails sur le swagger
];

app.use(cors({
  origin(origin, callback) {
    // autorise requêtes outils (postman, supertest) qui n'ont pas d'Origin
    if (!origin) return callback(null, true);

    // vérifie si l'Origin est dans la whitelist
    return allowedOrigins.includes(origin)
      ? callback(null, true) // le ? signifie "if"
      : callback(new Error('CORS: origin non autorisé')); // le : signifie "else"
  },
  methods: ['GET','POST','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

//endpoints de l'appli
const authRouter = require('./routes/auth.routes');
const contactRouter = require('./routes/contact.routes');

const error = require('./middlewares/error.middleware');

//Les middlewares (par exemple quand on reprend l'express pour parser le json ou tes endpoints)
app.use(express.json());
app.use('/auth', authRouter);
app.use('/contacts', contactRouter);
app.use(error);

//Documentation OpenAPI (Swagger)
const openapi = YAML.load(path.join(__dirname, 'docs/openapi.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));  // UI interactive
app.get('/openapi.json', (_req, res) => res.json(openapi));   // export JSON brut


//pour pouvoir importer app dans server.js
module.exports = app;