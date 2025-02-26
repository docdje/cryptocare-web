# Structure détaillée de la plateforme CryptoCare

## Structure du Frontend (React.js)

```
frontend/
├── public/                   # Ressources statiques
│   ├── index.html           # Template HTML principal
│   ├── favicon.ico          # Favicon du site
│   ├── locales/             # Fichiers de traduction (i18next)
│   │   ├── fr/              # Traductions françaises
│   │   └── en/              # Traductions anglaises
│   └── assets/              # Images et médias statiques
│       ├── logo.svg         # Logo CryptoCare
│       └── icons/           # Icônes du site
├── src/                      # Code source
│   ├── index.js             # Point d'entrée de l'application
│   ├── App.js               # Composant principal
│   ├── routes/              # Configuration des routes
│   ├── components/          # Composants React réutilisables
│   │   ├── common/          # Composants génériques (boutons, inputs, etc.)
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Alert.jsx
│   │   ├── layout/          # Composants de mise en page
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── PrivateLayout.jsx
│   │   ├── auth/            # Composants d'authentification
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── appointment/     # Composants liés aux rendez-vous
│   │   │   ├── AppointmentCard.jsx
│   │   │   ├── AppointmentForm.jsx
│   │   │   ├── TimeSlotPicker.jsx
│   │   │   └── ZoomLink.jsx
│   │   └── payment/         # Composants liés au paiement Bitcoin
│   │       ├── BitcoinQRCode.jsx
│   │       ├── PaymentStatus.jsx
│   │       └── WalletInfo.jsx
│   ├── pages/               # Pages principales de l'application
│   │   ├── Home.jsx         # Page d'accueil
│   │   ├── Login.jsx        # Page de connexion
│   │   ├── Register.jsx     # Page d'inscription
│   │   ├── Search.jsx       # Recherche de professionnels
│   │   ├── ProfilePage.jsx  # Profil utilisateur
│   │   ├── appointment/     # Pages liées aux rendez-vous
│   │   │   ├── AppointmentList.jsx
│   │   │   ├── AppointmentDetails.jsx
│   │   │   └── BookAppointment.jsx
│   │   ├── professional/    # Pages pour les professionnels de santé
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AvailabilitySettings.jsx
│   │   │   └── PatientList.jsx
│   │   └── payment/         # Pages liées au paiement
│   │       ├── Checkout.jsx
│   │       └── PaymentSuccess.jsx
│   ├── services/            # Services API et intégrations
│   │   ├── api.js           # Client API principal
│   │   ├── authService.js   # Gestion de l'authentification
│   │   ├── appointmentService.js # Gestion des rendez-vous
│   │   ├── paymentService.js # Service de paiement Bitcoin
│   │   └── zoomService.js   # Intégration avec Zoom
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js       # Hook d'authentification
│   │   ├── useAppointment.js # Hook de gestion des rendez-vous
│   │   └── usePayment.js    # Hook de paiement
│   ├── context/             # Contextes React
│   │   ├── AuthContext.js   # Contexte d'authentification
│   │   └── AppointmentContext.js # Contexte des rendez-vous
│   ├── utils/               # Fonctions utilitaires
│   │   ├── dateUtils.js     # Gestion des dates
│   │   ├── validation.js    # Validation des formulaires
│   │   ├── formatters.js    # Formatage des données
│   │   └── constants.js     # Constantes de l'application
│   └── styles/              # Styles CSS/SCSS
│       ├── main.scss        # Styles principaux
│       ├── variables.scss   # Variables SCSS
│       └── components/      # Styles spécifiques aux composants
├── .env                      # Variables d'environnement (dev)
├── .env.production           # Variables d'environnement (prod)
├── package.json              # Configuration npm et dépendances
└── webpack.config.js         # Configuration de build
```

## Structure du Backend (Node.js/Express)

```
backend/
├── server.js                 # Point d'entrée du serveur
├── app.js                    # Configuration de l'application Express
├── api/                      # API REST
│   ├── routes/               # Définition des routes
│   │   ├── auth.routes.js    # Routes d'authentification
│   │   ├── user.routes.js    # Routes utilisateurs
│   │   ├── appointment.routes.js # Routes des rendez-vous
│   │   ├── professional.routes.js # Routes des professionnels
│   │   └── payment.routes.js # Routes de paiement
│   ├── controllers/          # Contrôleurs
│   │   ├── auth.controller.js # Contrôleur d'authentification
│   │   ├── user.controller.js # Contrôleur utilisateurs
│   │   ├── appointment.controller.js # Contrôleur des rendez-vous
│   │   ├── professional.controller.js # Contrôleur des professionnels
│   │   └── payment.controller.js # Contrôleur de paiement
│   ├── middlewares/          # Middlewares Express
│   │   ├── auth.middleware.js # Middleware d'authentification
│   │   ├── validation.middleware.js # Validation des requêtes
│   │   ├── error.middleware.js # Gestion des erreurs
│   │   └── logger.middleware.js # Journalisation
│   └── validators/           # Schémas de validation
│       ├── auth.validators.js
│       ├── appointment.validators.js
│       └── payment.validators.js
├── config/                   # Configuration
│   ├── database.js           # Configuration PostgreSQL
│   ├── auth.js               # Configuration JWT
│   ├── zoom.js               # Configuration Zoom API
│   ├── bitcoin.js            # Configuration Swiss Bitcoin Pay
│   └── cors.js               # Configuration CORS
├── models/                   # Modèles de données
│   ├── index.js              # Initialisation Sequelize
│   ├── user.model.js         # Modèle utilisateur
│   ├── professional.model.js # Modèle professionnel de santé
│   ├── appointment.model.js  # Modèle rendez-vous
│   ├── availability.model.js # Modèle disponibilités
│   └── payment.model.js      # Modèle paiement
├── services/                 # Services métier
│   ├── auth.service.js       # Service d'authentification
│   ├── appointment.service.js # Service de gestion des rendez-vous
│   ├── notification.service.js # Service de notifications
│   ├── payment.service.js    # Service de paiement Bitcoin
│   └── zoom.service.js       # Service d'intégration Zoom
├── integrations/             # Intégrations externes
│   ├── zoom/                 # Intégration Zoom
│   │   ├── client.js         # Client API Zoom
│   │   ├── meeting.js        # Gestion des réunions Zoom
│   │   └── webhook.js        # Gestion des webhooks Zoom
│   └── bitcoin/              # Intégration Swiss Bitcoin Pay
│       ├── client.js         # Client Swiss Bitcoin Pay
│       ├── invoice.js        # Gestion des factures
│       └── webhook.js        # Gestion des webhooks de paiement
├── utils/                    # Fonctions utilitaires
│   ├── logger.js             # Configuration du logger
│   ├── errors.js             # Classes d'erreurs personnalisées
│   ├── security.js           # Utilitaires de sécurité
│   ├── date.js               # Utilitaires de date
│   └── validation.js         # Fonctions de validation
├── migrations/               # Migrations de base de données
│   ├── 20250301_create_users.js
│   ├── 20250301_create_professionals.js
│   └── 20250301_create_appointments.js
├── seeders/                  # Données initiales
│   ├── 20250301_seed_specialties.js
│   └── 20250301_seed_admin.js
├── tests/                    # Tests
│   ├── unit/                 # Tests unitaires
│   │   ├── auth.test.js
│   │   ├── appointment.test.js
│   │   └── payment.test.js
│   └── integration/          # Tests d'intégration
│       ├── auth.integration.test.js
│       ├── appointment.integration.test.js
│       └── payment.integration.test.js
├── docs/                     # Documentation
│   └── api.yaml              # Documentation OpenAPI
├── .env                      # Variables d'environnement (dev)
├── .env.production           # Variables d'environnement (prod)
├── package.json              # Configuration npm et dépendances
└── Dockerfile                # Configuration Docker
```

## Structure de la base de données PostgreSQL

```sql
-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_type ENUM('patient', 'professional', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des patients
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des spécialités médicales
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des professionnels de santé
CREATE TABLE professionals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    specialty_id INTEGER REFERENCES specialties(id),
    description TEXT,
    zoom_email VARCHAR(255),
    zoom_user_id VARCHAR(255),
    bitcoin_address VARCHAR(255),
    consultation_fee DECIMAL(15,8) DEFAULT 0.0005, -- en BTC
    phone VARCHAR(20),
    location VARCHAR(100),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des disponibilités
CREATE TABLE availabilities (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,  -- 0 = Dimanche, 1 = Lundi, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des exceptions de disponibilité (congés, etc.)
CREATE TABLE availability_exceptions (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des rendez-vous
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
    professional_id INTEGER REFERENCES professionals(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('scheduled', 'confirmed', 'cancelled', 'completed') DEFAULT 'scheduled',
    zoom_meeting_id VARCHAR(255),
    zoom_join_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paiements
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    amount DECIMAL(15,8) NOT NULL, -- en BTC
    invoice_id VARCHAR(255) NOT NULL,
    payment_request VARCHAR(500), -- Lightning Network payment request
    status ENUM('pending', 'paid', 'expired', 'refunded') DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Détails des intégrations API externes

### Intégration Zoom API

```javascript
// backend/integrations/zoom/client.js

const axios = require('axios');
const config = require('../../config/zoom');

class ZoomClient {
    constructor() {
        this.baseURL = 'https://api.zoom.us/v2';
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async getAccessToken() {
        // Si le token est valide, on le réutilise
        if (this.accessToken && this.tokenExpiry > Date.now()) {
            return this.accessToken;
        }

        try {
            const response = await axios.post('https://zoom.us/oauth/token', null, {
                params: {
                    grant_type: 'account_credentials',
                    account_id: config.accountId
                },
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
                }
            });

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
            
            return this.accessToken;
        } catch (error) {
            console.error('Erreur lors de la récupération du token Zoom:', error);
            throw new Error('Erreur d'authentification Zoom');
        }
    }

    async createMeeting(userId, topic, startTime, duration) {
        try {
            const token = await this.getAccessToken();
            
            const response = await axios.post(`${this.baseURL}/users/${userId}/meetings`, {
                topic,
                type: 2, // Réunion programmée
                start_time: startTime,
                duration,
                timezone: 'Europe/Zurich',
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    waiting_room: true
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return {
                meetingId: response.data.id,
                joinUrl: response.data.join_url,
                startUrl: response.data.start_url
            };
        } catch (error) {
            console.error('Erreur lors de la création de la réunion Zoom:', error);
            throw new Error('Impossible de créer la réunion Zoom');
        }
    }
}

module.exports = new ZoomClient();
```

### Intégration Swiss Bitcoin Pay

```javascript
// backend/integrations/bitcoin/client.js

const axios = require('axios');
const config = require('../../config/bitcoin');

class SwissBitcoinPayClient {
    constructor() {
        this.baseURL = config.apiUrl;
        this.apiKey = config.apiKey;
    }

    async createInvoice(amount, description, metadata) {
        try {
            const response = await axios.post(`${this.baseURL}/invoices`, {
                amount_btc: amount,
                description,
                metadata,
                webhook_url: `${config.webhookBaseUrl}/api/payments/webhook`,
                expiry: 600 // 10 minutes en secondes
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return {
                invoiceId: response.data.id,
                paymentRequest: response.data.payment_request,
                qrCode: response.data.qr_code,
                amount: response.data.amount_btc,
                status: response.data.status,
                expiresAt: response.data.expires_at
            };
        } catch (error) {
            console.error('Erreur lors de la création de la facture Bitcoin:', error);
            throw new Error('Impossible de créer la facture Bitcoin');
        }
    }

    async getInvoiceStatus(invoiceId) {
        try {
            const response = await axios.get(`${this.baseURL}/invoices/${invoiceId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            
            return {
                invoiceId: response.data.id,
                status: response.data.status,
                paidAt: response.data.paid_at
            };
        } catch (error) {
            console.error('Erreur lors de la récupération du statut de la facture:', error);
            throw new Error('Impossible de récupérer le statut de la facture');
        }
    }
}

module.exports = new SwissBitcoinPayClient();
```
