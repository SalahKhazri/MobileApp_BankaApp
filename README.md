# 🏦 Banka — Application Bancaire Mobile

Application bancaire mobile **full-stack** composée d'un backend REST API (Node.js / Express / MongoDB) et d'un frontend mobile (React Native / Expo).

---

## 📐 Architecture globale

```
┌─────────────────────────────────────────────────────────┐
│                    Téléphone (Expo Go)                   │
│                                                          │
│   ┌──────────────────────────────────────────────────┐  │
│   │           React Native App (banka-app)           │  │
│   │                                                  │  │
│   │  LoginScreen  →  HomeScreen  →  TransferScreen  │  │
│   │  RegisterScreen  DepositScreen  HistoryScreen   │  │
│   │                                                  │  │
│   │          src/services/api.js (fetch)             │  │
│   └──────────────────┬───────────────────────────────┘  │
└──────────────────────┼──────────────────────────────────┘
                       │ HTTP (même réseau Wi-Fi)
                       │ Authorization: Bearer <JWT>
┌──────────────────────┼──────────────────────────────────┐
│                 PC / Serveur                             │
│                                                          │
│   ┌──────────────────▼───────────────────────────────┐  │
│   │          Express API (banka-backend)             │  │
│   │                                                  │  │
│   │  /api/auth    →  authController  →  authService │  │
│   │  /api/accounts  →  accountController  →  ...   │  │
│   │  /api/transactions  →  transactionController   │  │
│   │                                                  │  │
│   │     authMiddleware (JWT)  +  errorMiddleware    │  │
│   └──────────────────┬───────────────────────────────┘  │
│                      │ Mongoose ODM                      │
│   ┌──────────────────▼───────────────────────────────┐  │
│   │                MongoDB                           │  │
│   │   Users  |  Accounts  |  Transactions           │  │
│   └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Structure complète du projet

```
banka/
│
├── banka-backend/                    ← API REST Node.js
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 ← Connexion MongoDB
│   │   │   └── env.js                ← Variables d'environnement
│   │   ├── models/
│   │   │   ├── User.js               ← Schéma utilisateur + bcrypt
│   │   │   ├── Account.js            ← Schéma compte bancaire
│   │   │   └── Transaction.js        ← Schéma transaction + index
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── accountController.js
│   │   │   └── transactionController.js
│   │   ├── services/
│   │   │   ├── authService.js        ← Logique JWT + auth
│   │   │   ├── accountService.js     ← Logique comptes
│   │   │   └── transactionService.js ← Virements atomiques (session MongoDB)
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── accountRoutes.js
│   │   │   └── transactionRoutes.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js     ← Vérification JWT + rôle admin
│   │   │   └── errorMiddleware.js    ← Gestion globale des erreurs
│   │   ├── utils/
│   │   │   ├── generateToken.js      ← Création JWT
│   │   │   └── response.js           ← Format uniforme des réponses
│   │   ├── app.js                    ← Config Express + routes
│   │   └── server.js                 ← Lancement serveur
│   ├── .env
│   ├── package.json
│   └── README.md
│
└── banka-app/                        ← App React Native
    ├── App.js                        ← Entrée principale
    ├── app.json                      ← Config Expo
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js        ← État global auth + AsyncStorage
    │   ├── navigation/
    │   │   └── AppNavigator.js       ← Stack Auth / Stack App
    │   ├── components/
    │   │   └── index.js              ← Button, Input, Card, Badge
    │   ├── utils/
    │   │   └── theme.js              ← Couleurs, espacements, radius
    │   ├── services/
    │   │   └── api.js                ← Toutes les requêtes HTTP
    │   └── screens/
    │       ├── LoginScreen.js
    │       ├── RegisterScreen.js
    │       ├── HomeScreen.js
    │       ├── DepositScreen.js
    │       ├── TransferScreen.js
    │       ├── HistoryScreen.js
    │       ├── NewAccountScreen.js
    │       └── ProfileScreen.js
    ├── package.json
    └── README.md
```

---

## ⚙️ Installation complète

### 1. Cloner le projet

```bash
git clone https://github.com/ton-user/banka.git
cd banka
```

### 2. Lancer le backend

```bash
cd banka-backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
# → Éditer .env avec tes valeurs (MONGO_URI, JWT_SECRET...)

# Lancer en développement
npm run dev
```

Vérifier que le serveur répond :
```
GET http://localhost:5000/api/health
→ { "success": true, "message": "Serveur opérationnel ✅" }
```

### 3. Lancer le frontend

```bash
cd ../banka-app

# Installer les dépendances
npm install

# Trouver son IP locale
ipconfig          # Windows
ifconfig          # Mac / Linux

# Modifier src/services/api.js
const BASE_URL = 'http://192.168.1.X:5000/api';  # ← ton IP

# Lancer Expo
npx expo start
```

Scanne le QR code avec **Expo Go** sur ton téléphone.

---

## 🌐 API — Endpoints

### Auth `/api/auth`

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | `/register` | Public | Créer un compte utilisateur |
| POST | `/login` | Public | Se connecter, recevoir le JWT |
| GET | `/profile` | 🔒 JWT | Voir son profil |

### Comptes `/api/accounts`

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | `/` | 🔒 JWT | Créer un compte bancaire |
| GET | `/` | 🔒 JWT | Lister ses comptes |
| GET | `/:id` | 🔒 JWT | Détail d'un compte |
| DELETE | `/:id` | 🔒 JWT | Fermer un compte |

### Transactions `/api/transactions`

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | `/:accountId/deposit` | 🔒 JWT | Effectuer un dépôt |
| POST | `/:accountId/transfer` | 🔒 JWT | Effectuer un virement |
| GET | `/:accountId/history` | 🔒 JWT | Historique paginé |

### Format des réponses

```json
// Succès
{ "success": true, "message": "...", "data": { ... } }

// Erreur
{ "success": false, "message": "Description de l'erreur." }
```

---

## 🔐 Sécurité

| Mécanisme | Détail |
|-----------|--------|
| Mots de passe | Hashés avec **bcryptjs** (coût 12) |
| Authentification | **JWT** signé, durée configurable (défaut 7j) |
| Routes protégées | Middleware `protect` vérifie le token à chaque requête |
| Virements | Transactions **atomiques** MongoDB (session + rollback auto) |
| Validation | Mongoose validators + messages d'erreur uniformes |
| Comptes | `select: false` sur le champ `password` — jamais exposé en API |

---

## 🗄️ Modèles de données

### User
```
_id, fullName, email (unique), phone (unique),
password (hashé, select:false), role (client|admin),
isActive, lastLogin, createdAt, updatedAt
```

### Account
```
_id, owner → User, accountNumber (auto-généré),
type (courant|epargne), balance (≥ 0),
currency (MAD), isActive, createdAt, updatedAt
```

### Transaction
```
_id, sender → Account, receiver → Account,
amount, currency, type (virement|depot|retrait),
status (en_attente|completee|echouee|annulee),
reference (auto-générée), description, fees,
balanceAfterSender, balanceAfterReceiver,
createdAt, updatedAt
```

---

## 🛠️ Stack technique

### Backend

| Outil | Version | Rôle |
|-------|---------|------|
| Node.js | >= 18 | Runtime |
| Express | ^4.18 | Framework HTTP |
| MongoDB | — | Base de données |
| Mongoose | ^7 | ODM |
| jsonwebtoken | ^9 | Authentification JWT |
| bcryptjs | ^2.4 | Hashage mots de passe |
| dotenv | ^16 | Variables d'environnement |
| cors | ^2.8 | Cross-Origin |
| nodemon | ^3 | Hot-reload dev |

### Frontend

| Outil | Version | Rôle |
|-------|---------|------|
| React Native | 0.74 | Framework mobile |
| Expo | ~51 | Toolchain |
| React Navigation | ^6 | Navigation |
| AsyncStorage | 1.23 | Persistance token |
| Expo Linear Gradient | ~13 | UI carte bancaire |
| Expo Vector Icons | ^14 | Icônes |

---

## 🧪 Ordre de test recommandé

```
1. POST /api/auth/register        → Créer un utilisateur
2. POST /api/auth/login           → Récupérer le token JWT
3. GET  /api/auth/profile         → Vérifier le profil
4. POST /api/accounts             → Créer un compte courant
5. POST /api/accounts             → Créer un compte épargne
6. GET  /api/accounts             → Lister les deux comptes
7. POST /api/transactions/:id/deposit   → Créditer 5000 MAD
8. POST /api/transactions/:id/transfer  → Virer 1500 MAD
9. GET  /api/transactions/:id/history   → Vérifier l'historique
10. DELETE /api/accounts/:id      → Fermer un compte (solde = 0)
```

---

## ❗ Résolution des problèmes fréquents

### `Network request failed` sur Expo Go

```
✅ Vérifications :
1. Backend lancé : npm run dev dans banka-backend
2. IP correcte dans src/services/api.js (pas localhost)
3. Même réseau Wi-Fi entre téléphone et PC
4. Port 5000 ouvert dans le pare-feu :
   → Windows : netsh advfirewall firewall add rule name="Node 5000" protocol=TCP dir=in localport=5000 action=allow
5. Test navigateur téléphone : http://TON_IP:5000/api/health
```

### `MongoDB connection error`

```
✅ Vérifications :
1. MongoDB installé et démarré (mongod)
2. URI correcte dans .env : MONGO_URI=mongodb://localhost:27017/banka
3. Ou utiliser MongoDB Atlas (cloud gratuit)
```

### `Token invalide ou expiré`

```
✅ Solution :
→ Se déconnecter et se reconnecter pour obtenir un nouveau token
→ Vérifier JWT_SECRET dans .env (doit être identique au démarrage)
```

---

## 👥 Auteurs

Projet réalisé dans le cadre d'un TP React Native / Node.js.

---
