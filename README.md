# Nomeryc — Frontend

Application web de Nomeryc, construite avec React, TypeScript et Vite. Elle regroupe le site public, l'espace client et le tableau de bord d'administration.

## Fonctionnalités

- Pages publiques : accueil, services, portfolio, blog, tarifs, présentation, contact et pages légales.
- Authentification, mot de passe oublié et réinitialisation.
- Espace client : projets, devis, factures, messages, notifications, documents et paramètres.
- Espace d'administration : clients, contacts, projets, devis, factures, portfolio, équipe, témoignages, FAQ, tarifs, blog, statistiques, tâches et messages.
- Communication avec l'API REST et les événements temps réel Socket.IO.

## Prérequis

- Node.js 20.19+ ou 22.12+.
- npm.
- Le backend Nomeryc pour les fonctionnalités connectées.

## Installation et démarrage

Depuis le dossier `Frontend` :

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Vite affiche l'adresse locale dans le terminal (par défaut `http://localhost:5173`). Pour créer le fichier `.env` dans un terminal Bash, utilisez `cp .env.example .env`.

## Configuration

Les variables du frontend sont préfixées par `VITE_` et sont intégrées au code livré au navigateur : n'y placez jamais de secret.

| Variable | Description | Valeur locale suggérée |
| --- | --- | --- |
| `VITE_API_URL` | URL de base de l'API REST | `http://localhost:5000/api/v1` |
| `VITE_SOCKET_URL` | URL racine du serveur Socket.IO, sans `/api/v1` | `http://localhost:5000` |

Ces valeurs figurent dans `.env.example`. Si le backend ou le frontend utilise une autre adresse, adaptez aussi `CORS_ORIGIN` et `FRONTEND_URL` dans la configuration du backend.

## Commandes

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance le serveur Vite en développement avec rechargement à chaud. |
| `npm run build` | Vérifie les projets TypeScript puis génère la version de production dans `dist/`. |
| `npm run preview` | Sert localement la version de production déjà construite. |
| `npm run lint` | Analyse le code avec Oxlint. |

## Organisation du code

```text
src/
├── components/   # Composants partagés et mises en page
├── pages/        # Pages publiques, client et administration
├── routes/       # Protection des routes
├── services/     # Appels API et Socket.IO
├── store/        # État partagé, notamment l'authentification
├── assets/       # Images et ressources
├── App.tsx       # Routage de l'application
└── main.tsx      # Point d'entrée React
```

Les styles utilisent Tailwind CSS et les styles globaux de `src/index.css` et `src/App.css`.

## Production

Exécutez `npm run build`, puis déployez le contenu de `dist/` sur un hébergement statique. Configurez le serveur web pour renvoyer `index.html` pour les routes de l'application (par exemple `/client/projets`), et renseignez les URL de production de l'API et de Socket.IO avant la compilation.
