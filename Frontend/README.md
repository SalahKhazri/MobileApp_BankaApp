# 📱 Banka App — Frontend Mobile

Interface mobile de l'application bancaire **Banka**, développée avec **React Native** et **Expo Go**.

---

## 📸 Aperçu des écrans

| Login | Register | Dashboard |
|-------|----------|-----------|
| Connexion sécurisée JWT | Création de compte | Carte de solde + actions rapides |

| Dépôt | Virement | Historique |
|-------|----------|------------|
| Montants rapides | Validation solde | Pagination infinie |

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js >= 18
- Expo CLI : `npm install -g expo-cli`
- Application **Expo Go** installée sur ton téléphone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Le backend **Banka** lancé et accessible sur le réseau local

### Installation

```bash
# Cloner le projet
git clone https://github.com/ton-user/banka-app.git
cd banka-app

# Installer les dépendances
npm install
```

### Configuration

Avant de lancer l'app, configure l'URL de l'API dans `src/services/api.js` :

```javascript
// Remplace par l'IP locale de ton PC
const BASE_URL = 'http://192.168.1.X:5000/api';
```

**Comment trouver ton IP locale :**

```bash
# Windows
ipconfig
# → Cherche "Adresse IPv4" sous "Carte Wi-Fi"

# Mac / Linux
ifconfig
# → Cherche "inet" sous "en0" ou "wlan0"
```

> ⚠️ Ton téléphone et ton PC doivent être connectés au **même réseau Wi-Fi**.  
> Ne jamais utiliser `localhost` — cela pointe vers le téléphone lui-même, pas ton PC.

### Lancement

```bash
npx expo start
```

Scanne le QR code avec **Expo Go** (Android) ou l'appareil photo (iOS).

---

## 📁 Structure du projet

```
banka-app/
├── App.js                          ← Point d'entrée principal
├── app.json                        ← Configuration Expo
├── babel.config.js
├── package.json
└── src/
    ├── context/
    │   └── AuthContext.js          ← Gestion globale auth (JWT + AsyncStorage)
    ├── navigation/
    │   └── AppNavigator.js         ← Routing Auth / App
    ├── components/
    │   └── index.js                ← Composants réutilisables (Button, Input, Card...)
    ├── utils/
    │   └── theme.js                ← Couleurs, espacements, typographie
    ├── services/
    │   └── api.js                  ← Toutes les requêtes vers le backend
    └── screens/
        ├── LoginScreen.js          ← Connexion
        ├── RegisterScreen.js       ← Inscription
        ├── HomeScreen.js           ← Dashboard principal
        ├── DepositScreen.js        ← Effectuer un dépôt
        ├── TransferScreen.js       ← Effectuer un virement
        ├── HistoryScreen.js        ← Historique des transactions
        ├── NewAccountScreen.js     ← Créer un compte bancaire
        └── ProfileScreen.js        ← Profil + déconnexion
```

---

## 🖥️ Écrans de l'application

### 🔐 Authentification

| Écran | Description |
|-------|-------------|
| `LoginScreen` | Connexion avec email + mot de passe, affichage/masquage du mot de passe |
| `RegisterScreen` | Inscription avec validation de formulaire complète |

### 🏦 Application principale

| Écran | Description |
|-------|-------------|
| `HomeScreen` | Carte de solde avec gradient, sélecteur de comptes, 4 actions rapides |
| `DepositScreen` | Dépôt avec montants rapides (500 / 1000 / 2000 / 5000) + confirmation |
| `TransferScreen` | Virement avec validation du solde + confirmation avant envoi |
| `HistoryScreen` | Historique paginé avec pull-to-refresh et chargement infini |
| `NewAccountScreen` | Création d'un compte Courant ou Épargne |
| `ProfileScreen` | Informations utilisateur + déconnexion |

---

## 🔌 Connexion à l'API

Toutes les requêtes sont centralisées dans `src/services/api.js` :

```javascript
const BASE_URL = 'http://TON_IP:5000/api';
```

| Fonction | Méthode | Endpoint |
|----------|---------|----------|
| `register()` | POST | `/auth/register` |
| `login()` | POST | `/auth/login` |
| `getProfile()` | GET | `/auth/profile` |
| `createAccount()` | POST | `/accounts` |
| `getAccounts()` | GET | `/accounts` |
| `deposit()` | POST | `/transactions/:id/deposit` |
| `transfer()` | POST | `/transactions/:id/transfer` |
| `getHistory()` | GET | `/transactions/:id/history` |

Le token JWT est automatiquement sauvegardé dans `AsyncStorage` après le login et attaché à chaque requête via le header `Authorization: Bearer <token>`.

---

## 🎨 Design System

Le thème est défini dans `src/utils/theme.js` :

```javascript
// Couleurs principales
colors.bg         // #0A0F1E  — fond sombre
colors.bgCard     // #111827  — cartes
colors.primary    // #3B82F6  — bleu principal
colors.success    // #10B981  — vert (solde positif)
colors.danger     // #EF4444  — rouge (erreurs)
colors.purple     // #8B5CF6  — violet (épargne)
```

---

## 🛠️ Technologies

| Outil | Version | Rôle |
|-------|---------|------|
| React Native | 0.74 | Framework mobile |
| Expo | ~51 | Toolchain + build |
| React Navigation | ^6 | Navigation entre écrans |
| AsyncStorage | 1.23 | Persistance du token JWT |
| Expo Linear Gradient | ~13 | Carte de solde dégradée |
| Expo Vector Icons | ^14 | Icônes Ionicons |

---

## ❗ Problèmes fréquents

### `Network request failed`

Le téléphone ne peut pas atteindre le backend.

```
1. Vérifie que le backend est lancé : npm run dev
2. Remplace localhost par ton IP dans api.js
3. Téléphone et PC sur le même Wi-Fi
4. Ouvre le port 5000 dans le pare-feu Windows :
   → netsh advfirewall firewall add rule name="Node 5000" protocol=TCP dir=in localport=5000 action=allow
5. Teste dans le navigateur du téléphone : http://TON_IP:5000/api/health
```

### `Cannot read property of undefined`

Vérifie que le backend retourne bien le format `{ success, data }` attendu.

### Token expiré

Déconnecte-toi et reconnecte-toi — un nouveau token sera généré.

---