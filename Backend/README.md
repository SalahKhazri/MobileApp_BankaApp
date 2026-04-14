# 🏦 Banka — Backend API

API REST sécurisée pour une application bancaire mobile. Construite avec **Node.js**, **Express**, **MongoDB** et **JWT**.

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js >= 18
- MongoDB (local ou Atlas)

### Installation

```bash
# Cloner le projet
git clone https://github.com/ton-user/banka-backend.git
cd banka-backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
```

### Variables d'environnement (`.env`)



### Lancement

```bash
# Développement (avec hot-reload)
npm run dev

# Production
npm start
```

Serveur disponible sur : `http://localhost:5000`

---

## 📁 Architecture

```
banka-backend/
├── src/
│   ├── config/
│   │   ├── db.js               ← Connexion MongoDB
│   │   └── env.js              ← Variables d'environnement
│   ├── models/
│   │   ├── User.js             ← Utilisateur (auth)
│   │   ├── Account.js          ← Comptes bancaires
│   │   └── Transaction.js      ← Virements / opérations
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── accountController.js
│   │   └── transactionController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── accountService.js
│   │   └── transactionService.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── accountRoutes.js
│   │   └── transactionRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js   ← Vérification JWT
│   │   └── errorMiddleware.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── response.js
│   ├── app.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

---

## 📡 Endpoints API

### 🔐 Authentification — `/api/auth`

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | `/api/auth/register` | Public | Créer un compte |
| POST | `/api/auth/login` | Public | Se connecter |
| GET | `/api/auth/profile` | Protégé | Voir son profil |

---

#### `POST /api/auth/register`

**Body :**
```json
{
  "fullName": "Youssef Alami",
  "email": "youssef@email.com",
  "phone": "+212600000000",
  "password": "motdepasse123"
}
```

**Réponse `201` :**
```json
{
  "success": true,
  "message": "Compte créé avec succès.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "664abc...",
      "fullName": "Youssef Alami",
      "email": "youssef@email.com",
      "phone": "+212600000000",
      "role": "client"
    }
  }
}
```

---

#### `POST /api/auth/login`

**Body :**
```json
{
  "email": "youssef@email.com",
  "password": "motdepasse123"
}
```

**Réponse `200` :**
```json
{
  "success": true,
  "message": "Connexion réussie.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "664abc...",
      "fullName": "Youssef Alami",
      "email": "youssef@email.com",
      "role": "client",
      "lastLogin": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

#### `GET /api/auth/profile` 🔒

**Header :**
```
Authorization: Bearer <token>
```

**Réponse `200` :**
```json
{
  "success": true,
  "message": "Profil récupéré.",
  "data": {
    "_id": "664abc...",
    "fullName": "Youssef Alami",
    "email": "youssef@email.com",
    "phone": "+212600000000",
    "role": "client",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 🏦 Comptes bancaires — `/api/accounts`

> Toutes les routes nécessitent un token JWT.

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/accounts` | Créer un compte bancaire |
| GET | `/api/accounts` | Lister ses comptes |
| GET | `/api/accounts/:id` | Détail d'un compte |
| DELETE | `/api/accounts/:id` | Fermer un compte |

---

#### `POST /api/accounts` 🔒

**Body :**
```json
{
  "type": "courant",
  "currency": "MAD"
}
```

**Réponse `201` :**
```json
{
  "success": true,
  "message": "Compte bancaire créé.",
  "data": {
    "_id": "665xyz...",
    "owner": "664abc...",
    "accountNumber": "MA17082938471234",
    "type": "courant",
    "balance": 0,
    "currency": "MAD",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

#### `GET /api/accounts` 🔒

**Réponse `200` :**
```json
{
  "success": true,
  "message": "Comptes récupérés.",
  "data": [
    {
      "_id": "665xyz...",
      "accountNumber": "MA17082938471234",
      "type": "courant",
      "balance": 5000,
      "currency": "MAD"
    },
    {
      "_id": "665abc...",
      "accountNumber": "MA17082938475678",
      "type": "epargne",
      "balance": 20000,
      "currency": "MAD"
    }
  ]
}
```

---

#### `DELETE /api/accounts/:id` 🔒

> ⚠️ Impossible de fermer un compte avec un solde positif.

**Réponse `200` :**
```json
{
  "success": true,
  "message": "Compte fermé avec succès.",
  "data": { "isActive": false }
}
```

---

### 💸 Transactions — `/api/transactions`

> Toutes les routes nécessitent un token JWT.

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/transactions/:accountId/transfer` | Effectuer un virement |
| POST | `/api/transactions/:accountId/deposit` | Effectuer un dépôt |
| GET | `/api/transactions/:accountId/history` | Historique des transactions |

---

#### `POST /api/transactions/:accountId/transfer` 🔒

> `:accountId` = ID du compte **émetteur**

**Body :**
```json
{
  "receiverAccountNumber": "MA17082938475678",
  "amount": 1500,
  "description": "Remboursement loyer"
}
```

**Réponse `201` :**
```json
{
  "success": true,
  "message": "Virement effectué avec succès.",
  "data": {
    "_id": "667txn...",
    "reference": "TXN170829384712345",
    "type": "virement",
    "status": "completee",
    "amount": 1500,
    "currency": "MAD",
    "description": "Remboursement loyer",
    "balanceAfterSender": 3500,
    "balanceAfterReceiver": 21500,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

#### `POST /api/transactions/:accountId/deposit` 🔒

**Body :**
```json
{
  "amount": 3000,
  "description": "Salaire janvier"
}
```

**Réponse `201` :**
```json
{
  "success": true,
  "message": "Dépôt effectué avec succès.",
  "data": {
    "reference": "TXN170829384799999",
    "type": "depot",
    "status": "completee",
    "amount": 3000,
    "balanceAfterReceiver": 8000
  }
}
```

---

#### `GET /api/transactions/:accountId/history` 🔒

**Query params :**

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `page` | number | 1 | Numéro de page |
| `limit` | number | 10 | Résultats par page |

**Exemple :** `/api/transactions/665xyz.../history?page=1&limit=5`

**Réponse `200` :**
```json
{
  "success": true,
  "message": "Historique récupéré.",
  "data": {
    "transactions": [
      {
        "_id": "667txn...",
        "reference": "TXN170829384712345",
        "type": "virement",
        "status": "completee",
        "amount": 1500,
        "sender": { "accountNumber": "MA17082938471234", "type": "courant" },
        "receiver": { "accountNumber": "MA17082938475678", "type": "epargne" },
        "createdAt": "2024-01-15T11:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "pages": 9
    }
  }
}
```

---

## ❌ Format des erreurs

Toutes les erreurs retournent le même format :

```json
{
  "success": false,
  "message": "Description de l'erreur."
}
```

| Code | Signification |
|------|---------------|
| 400 | Données invalides / champ manquant |
| 401 | Non authentifié / token invalide |
| 403 | Accès interdit (ex: admin requis) |
| 404 | Ressource introuvable |
| 500 | Erreur interne du serveur |

---

## 🔒 Authentification

L'API utilise **JWT (JSON Web Token)**. Pour les routes protégées, ajouter le header suivant :

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Le token est retourné lors du `register` et du `login`. Sa durée de vie est configurée via `JWT_EXPIRES_IN` (défaut : 7 jours).

---

## 🧪 Tester l'API avec Postman

1. Importer la collection Postman (ou créer les requêtes manuellement)
2. Créer une variable d'environnement `{{baseUrl}}` = `http://localhost:5000`
3. Créer une variable `{{token}}` et la remplir après le login
4. Utiliser `Bearer {{token}}` dans l'onglet Authorization

### Ordre de test recommandé

```
1. POST /api/auth/register      → créer un utilisateur
2. POST /api/auth/login         → récupérer le token
3. POST /api/accounts           → créer un compte
4. POST /api/accounts           → créer un 2e compte (pour tester le virement)
5. POST /api/transactions/:id/deposit    → créditer le compte
6. POST /api/transactions/:id/transfer  → effectuer un virement
7. GET  /api/transactions/:id/history   → voir l'historique
```

---

## 🛠️ Technologies

| Outil | Rôle |
|-------|------|
| Node.js | Runtime JavaScript |
| Express | Framework HTTP |
| MongoDB | Base de données NoSQL |
| Mongoose | ODM pour MongoDB |
| JWT | Authentification stateless |
| bcryptjs | Hashage des mots de passe |
| dotenv | Gestion des variables d'env |
| cors | Gestion des origines cross-domain |
| nodemon | Hot-reload en développement |

---

