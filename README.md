# 📒 MyContacts – Backend

API REST sécurisée pour gérer un carnet de contacts.  
Développée avec **Node.js**, **Express**, **MongoDB Atlas** et **JWT**.  

## 🚀 Fonctionnalités

- 🔐 **Authentification JWT** :  
  - `POST /auth/register` → inscription avec hash bcrypt  
  - `POST /auth/login` → connexion avec génération de token  
- 👤 **Utilisateurs** : modèle User avec email unique + mot de passe hashé  
- 📇 **Contacts (CRUD)** :  
  - `GET /contacts` → lister les contacts d’un utilisateur  
  - `POST /contacts` → ajouter un contact (lié au user connecté)  
  - `PATCH /contacts/:id` → modifier les champs autorisés d’un contact  
  - `DELETE /contacts/:id` → supprimer un contact  
- ⚙️ **Sécurité** :  
  - CORS configuré (front autorisé via env)  
  - Helmet + rate limiting  
  - Middleware centralisé de gestion des erreurs  
- 📖 **Documentation Swagger** disponible via `/api-docs`

---

## ⚙️ Installation

### 1. Cloner le repo
```bash
git clone https://github.com/DannyNaco/mycontacts-back.git
cd mycontacts-back
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l’environnement
Crée un fichier `.env` à la racine de `mycontacts-back/` :

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mycontacts
JWT_SECRET=une_cle_ultra_secrete
JWT_EXPIRES_IN=1h
FRONTEND_URL=http://localhost:5173
```

> ⚠️ Ne commit jamais ton `.env`.

---

## 🏃 Lancer le projet

### Développement
```bash
npm run dev
```
Le serveur démarre sur : [http://localhost:3000](http://localhost:3000)  
Nodemon redémarre automatiquement à chaque changement.

### Production
```bash
npm start
```

---

## 🌐 API (exemples)

### Auth
```http
POST /auth/register
Content-Type: application/json

{
  "nomprenom": "Jean Dupont",
  "email": "jean@test.com",
  "password": "azerty123"
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "email": "jean@test.com",
  "password": "azerty123"
}
```

### Contacts
⚠️ Toutes les routes contacts nécessitent `Authorization: Bearer <token>`

- **Lister** :
```http
GET /contacts
```

- **Créer** :
```http
POST /contacts
Content-Type: application/json
Authorization: Bearer <token>

{
  "firstName": "Marie",
  "lastName": "Durand",
  "phone": "+33612345678",
  "anneeNaissance": 1995
}
```

---

## 📖 Swagger

Lancer le projet puis accéder à :  
👉 [http://localhost:3000/docs](http://localhost:3000/docs)  

---


## 👤 Auteur

Projet pédagogique – EFREI / M1
Backend développé par **Danny Navarro Cordeau**  
