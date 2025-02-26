# CryptoCare - Plateforme de télémédecine avec paiement en Bitcoin

![CryptoCare Logo](assets/logo.png)

## À propos du projet

CryptoCare est une plateforme de télémédecine innovante basée à Zoug, Suisse, qui permet aux patients de consulter des professionnels de santé à distance via Zoom avec un paiement exclusif en Bitcoin (BTC) via le système Swiss Bitcoin Pay.

### Caractéristiques principales

- 🩺 **Téléconsultations** via intégration Zoom
- 💰 **Paiement en Bitcoin** (Lightning Network)
- 📱 **Applications Web et Mobile** responsive
- 🔒 **Conforme RGPD et LPD** (aucun stockage de données médicales)
- 🌍 **Multilingue** (Français, Anglais, extensible à l'Allemand)

## Prérequis techniques

- Node.js v16+
- PostgreSQL 14+
- Docker et Docker Compose
- Clés API pour Zoom et Swiss Bitcoin Pay

## Installation

### Configuration de l'environnement

1. Clonez le repository:

```bash
git clone https://github.com/cryptocare-sa/cryptocare-platform.git
cd cryptocare-platform
```

2. Installez les dépendances:

```bash
# Installation des dépendances Backend
cd backend
npm install

# Installation des dépendances Frontend
cd ../frontend
npm install

# Installation des dépendances Mobile
cd ../mobile
npm install
```

3. Configurez les variables d'environnement:

Créez un fichier `.env` dans les dossiers `backend`, `frontend` et `mobile` en vous basant sur les fichiers `.env.example` fournis.

### Lancement avec Docker

```bash
docker-compose up -d
```

### Lancement manuel

#### Backend:
```bash
cd backend
npm run dev
```

#### Frontend:
```bash
cd frontend
npm start
```

#### Mobile:
```bash
cd mobile
npm start
```

## Structure du projet

```
cryptocare/
├── backend/               # API Node.js + Express
│   ├── api/               # Endpoints REST
│   ├── config/            # Configuration
│   ├── models/            # Modèles PostgreSQL
│   └── integrations/      # Intégrations Zoom et SwissBitcoinPay
├── frontend/              # Application Web React
│   ├── public/            # Ressources statiques
│   └── src/               # Code source React
├── mobile/                # Application React Native
│   ├── assets/            # Ressources de l'application
│   └── src/               # Code source React Native
└── docs/                  # Documentation technique
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Informations utilisateur

### Rendez-vous
- `GET /api/appointments` - Liste des rendez-vous
- `POST /api/appointments` - Création d'un rendez-vous
- `GET /api/appointments/:id` - Détails d'un rendez-vous
- `DELETE /api/appointments/:id` - Annulation d'un rendez-vous

### Disponibilités
- `GET /api/availability/:professionalId` - Créneaux disponibles
- `POST /api/availability` - Ajout de créneaux (pros)

### Paiements
- `POST /api/payments/invoice` - Création facture Bitcoin
- `GET /api/payments/status/:invoiceId` - Statut du paiement

## Intégrations

### Zoom API
La plateforme utilise l'API Zoom v2 pour générer des liens de réunion pour les téléconsultations.

### Swiss Bitcoin Pay
L'intégration avec Swiss Bitcoin Pay permet de générer des QR codes pour les paiements Lightning Network en Bitcoin.

## Déploiement

### Production
La plateforme est déployée sur DigitalOcean en région Suisse avec:
- Droplet: 4 GB RAM, 2 vCPUs
- SSD: 10 Go minimum
- Domaine: cryptocare.ch

### CI/CD
Le projet utilise GitHub Actions pour:
- Tests automatiques
- Déploiement continu
- Vérification de la sécurité

## Sécurité

- HTTPS via Let's Encrypt
- Authentification JWT (tokens renouvelés 24h)
- Chiffrement AES-256 pour les données sensibles
- Aucun stockage de données médicales (conformité LPD/RGPD)

## Calendrier

- Mars 2025: Spécifications, maquettes UX
- Avril-Mai 2025: Développement
- Juin 2025: Tests, intégrations, déploiement
- 1er juillet 2025: Lancement pilote à Zoug

## Licence

Ce projet est propriétaire et appartient à CryptoCare SA.

## Contact

Pour toute question ou support technique:
- Email: support@cryptocare.ch
- Site web: https://cryptocare.ch
