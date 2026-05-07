# SmartFridge AntiGaspi Backend

Une application backend complète pour la réduction du gaspillage alimentaire avec gestion intelligente du réfrigérateur.

## Fonctionnalités

- 🏠 **Gestion du réfrigérateur intelligent** : Suivi des produits, dates d'expiration, et emplacements
- 👤 **Gestion des utilisateurs** : Authentification JWT, profils personnalisés
- 📦 **Catalogue de produits** : Base de données de produits avec informations nutritionnelles
- 🍳 **Recettes** : Création et partage de recettes anti-gaspi
- 🔔 **Alertes** : Notifications pour produits périmés et stock faible
- 📊 **Statistiques** : Tableaux de bord sur le gaspillage alimentaire
- 🔒 **Sécurité** : Authentification sécurisée, validation des données

## Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hachage des mots de passe
- **Swagger** - Documentation API
- **Jest** - Tests unitaires

## Installation

### Prérequis

- Node.js 16+ 
- MongoDB 4.4+
- npm ou yarn

### Étapes

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd SmartFridge-AntiGaspi
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   
   Éditez le fichier `.env` avec vos configurations :
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/smartfridge-antigaspi
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=12
   ```

4. **Démarrer MongoDB**
   ```bash
   # Si MongoDB est installé localement
   mongod
   ```

5. **Démarrer le serveur**
   ```bash
   # Mode développement
   npm run dev
   
   # Mode production
   npm start
   ```

## Documentation API

Une fois le serveur démarré, accédez à la documentation Swagger :
```
http://localhost:3000/api-docs
```

### Endpoints principaux

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/profile` - Mettre à jour le profil

#### Produits
- `GET /api/products` - Lister les produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Ajouter un produit
- `PUT /api/products/:id` - Mettre à jour un produit
- `DELETE /api/products/:id` - Supprimer un produit
- `GET /api/products/barcode/:barcode` - Rechercher par code-barres

#### Réfrigérateur
- `GET /api/fridge` - Lister les items du réfrigérateur
- `POST /api/fridge` - Ajouter un item
- `PUT /api/fridge/:id` - Mettre à jour un item
- `DELETE /api/fridge/:id` - Supprimer un item
- `GET /api/fridge/expiring-soon` - Items expirant bientôt
- `GET /api/fridge/expired` - Items expirés
- `POST /api/fridge/:id/consume` - Marquer comme consommé
- `GET /api/fridge/stats/summary` - Statistiques du réfrigérateur

#### Recettes
- `GET /api/recipes` - Lister les recettes
- `GET /api/recipes/:id` - Détails d'une recette
- `POST /api/recipes` - Créer une recette
- `PUT /api/recipes/:id` - Mettre à jour une recette
- `DELETE /api/recipes/:id` - Supprimer une recette
- `POST /api/recipes/:id/rate` - Noter une recette

## Tests

### Exécuter les tests
```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Couverture de code
npm run test -- --coverage
```

### Structure des tests
- `tests/` - Répertoire des tests
- `tests/auth.test.js` - Tests d'authentification
- `tests/setup.js` - Configuration des tests

## Structure du projet

```
SmartFridge-AntiGaspi/
├── src/
│   ├── config/          # Configuration (base de données, Swagger)
│   ├── controllers/     # Logique métier (à implémenter)
│   ├── middleware/      # Middleware (auth, erreurs)
│   ├── models/          # Modèles de données MongoDB
│   ├── routes/          # Routes API
│   ├── utils/           # Utilitaires (à implémenter)
│   └── server.js        # Point d'entrée du serveur
├── tests/               # Tests unitaires
├── .env.example         # Variables d'environnement exemple
├── package.json         # Dépendances et scripts
└── README.md           # Documentation
```

## Développement

### Scripts disponibles

- `npm start` - Démarrer le serveur en production
- `npm run dev` - Démarrer le serveur en développement avec nodemon
- `npm test` - Exécuter les tests
- `npm run test:watch` - Exécuter les tests en mode watch
- `npm run lint` - Linter le code
- `npm run lint:fix` - Corriger automatiquement les problèmes de linting

### Bonnes pratiques

- Utiliser les variables d'environnement pour les configurations sensibles
- Valider toutes les entrées utilisateur
- Utiliser les middleware d'authentification pour les routes protégées
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les nouvelles routes avec Swagger

## Déploiement

### Variables d'environnement de production

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-db-uri
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
```

### Docker (optionnel)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository GitHub.

---

**SmartFridge AntiGaspi** - Réduisons le gaspillage alimentaire ensemble ! 🌱
