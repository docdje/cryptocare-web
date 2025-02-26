}]
  }
};
```

### 3.3 Style de codage React

#### 3.3.1 Composants fonctionnels

Privilégier les composants fonctionnels avec hooks:

```jsx
// Good
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function ProfessionalCard({ professional, onSelect }) {
  const { t } = useTranslation('professionals');
  const [isAvailable, setIsAvailable] = useState(false);
  
  useEffect(() => {
    checkAvailability(professional.id)
      .then(response => setIsAvailable(response.data.available));
  }, [professional.id]);
  
  return (
    <div className="professional-card">
      <h3>{professional.firstName} {professional.lastName}</h3>
      <p>{t('specialty')}: {professional.specialty.name}</p>
      <p>{isAvailable ? t('available') : t('unavailable')}</p>
      <button onClick={() => onSelect(professional)}>
        {t('select')}
      </button>
    </div>
  );
}

export default ProfessionalCard;
```

#### 3.3.2 Props et PropTypes

Toujours définir les PropTypes pour la validation des props:

```jsx
import PropTypes from 'prop-types';

function Button({ label, onClick, disabled, variant }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger'])
};

Button.defaultProps = {
  disabled: false,
  variant: 'primary'
};

export default Button;
```

### 3.4 Style de codage Node.js

#### 3.4.1 Contrôleurs

```javascript
// controllers/appointment.controller.js
const { Appointment, Professional, User } = require('../models');
const { NotFoundError, ValidationError } = require('../utils/errors');
const zoomService = require('../integrations/zoom');

/**
 * Création d'un nouveau rendez-vous
 * @route POST /api/appointments
 */
exports.createAppointment = async (req, res, next) => {
  try {
    const { professionalId, date, startTime, endTime } = req.body;
    const patientId = req.user.id;
    
    // Vérifier l'existence du professionnel
    const professional = await Professional.findByPk(professionalId);
    if (!professional) {
      throw new NotFoundError('Professional not found');
    }
    
    // Vérifier la disponibilité
    const isAvailable = await checkAvailability(professionalId, date, startTime, endTime);
    if (!isAvailable) {
      throw new ValidationError('This time slot is not available');
    }
    
    // Créer le rendez-vous
    const appointment = await Appointment.create({
      professionalId,
      patientId,
      date,
      startTime,
      endTime,
      status: 'scheduled'
    });
    
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};
```

#### 3.4.2 Services

```javascript
// services/appointment.service.js
const { Op } = require('sequelize');
const { Appointment, Availability } = require('../models');

/**
 * Vérifie si un créneau est disponible pour un professionnel
 * @param {number} professionalId - ID du professionnel
 * @param {string} date - Date au format YYYY-MM-DD
 * @param {string} startTime - Heure de début au format HH:MM
 * @param {string} endTime - Heure de fin au format HH:MM
 * @returns {Promise<boolean>} - True si disponible, false sinon
 */
async function checkAvailability(professionalId, date, startTime, endTime) {
  // Vérifier les rendez-vous existants
  const existingAppointments = await Appointment.findAll({
    where: {
      professionalId,
      date,
      [Op.or]: [
        { 
          startTime: { [Op.lt]: endTime },
          endTime: { [Op.gt]: startTime }
        }
      ],
      status: { [Op.ne]: 'cancelled' }
    }
  });
  
  if (existingAppointments.length > 0) {
    return false;
  }
  
  // Vérifier les disponibilités définies
  const dayOfWeek = new Date(date).getDay();
  const availabilities = await Availability.findAll({
    where: {
      professionalId,
      dayOfWeek,
      startTime: { [Op.lte]: startTime },
      endTime: { [Op.gte]: endTime }
    }
  });
  
  return availabilities.length > 0;
}

module.exports = {
  checkAvailability
};
```

### 3.5 Documentation du code

#### 3.5.1 JSDoc pour JavaScript

```javascript
/**
 * Génère une facture Bitcoin pour un rendez-vous
 * @param {Object} options - Options de création de facture
 * @param {number} options.appointmentId - ID du rendez-vous
 * @param {number} options.amount - Montant en BTC
 * @param {string} options.description - Description de la facture
 * @returns {Promise<Object>} Détails de la facture générée
 * @throws {ApiError} Si l'API Swiss Bitcoin Pay est indisponible
 */
async function createInvoice({ appointmentId, amount, description }) {
  // Implementation...
}
```

#### 3.5.2 Commentaires généraux

- Utiliser des commentaires pour expliquer le "pourquoi", pas le "quoi"
- Commenter le code complexe ou non évident
- Éviter les commentaires inutiles ou redondants

```javascript
// Good
// Utilisation d'un timeout pour éviter les requêtes trop fréquentes
// à l'API Zoom qui a une limite de 10 req/s
setTimeout(() => fetchZoomMeeting(id), 100);

// Bad
// Récupérer les utilisateurs
getUsers();
```

## 4. API et intégrations

### 4.1 API CryptoCare

L'API REST de CryptoCare est documentée dans le fichier [api-documentation.md](./docs/api-documentation.md). Voici les principes essentiels:

- Base URL: `https://api.cryptocare.ch/api/v1` (production)
- Format: JSON
- Authentification: JWT (Bearer token)
- Gestion d'erreur standardisée

### 4.2 Intégration Zoom

#### 4.2.1 Configuration

L'intégration avec Zoom nécessite:
- Un compte Zoom avec un plan Pro/Business
- Une app Zoom de type OAuth avec les scopes:
  - `meeting:write:admin`
  - `meeting:read:admin`
  - `user:read:admin`

Configuration dans le fichier `.env`:
```
ZOOM_CLIENT_ID=your_client_id
ZOOM_CLIENT_SECRET=your_client_secret
ZOOM_ACCOUNT_ID=your_account_id
```

#### 4.2.2 Exemple d'utilisation

```javascript
// integrations/zoom/meeting.js
const zoomClient = require('./client');

/**
 * Crée une réunion Zoom pour un rendez-vous
 * @param {Object} appointment - Détails du rendez-vous
 * @returns {Promise<Object>} Détails de la réunion Zoom
 */
async function createMeetingForAppointment(appointment) {
  const { date, startTime, endTime, professional, patient } = appointment;
  
  const startDateTime = new Date(`${date}T${startTime}`);
  const durationMinutes = calculateDurationMinutes(startTime, endTime);
  
  try {
    const meeting = await zoomClient.createMeeting({
      topic: 'Consultation médicale',
      type: 2, // Scheduled meeting
      start_time: startDateTime.toISOString(),
      duration: durationMinutes,
      timezone: 'Europe/Zurich',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        waiting_room: true,
        meeting_authentication: true
      }
    });
    
    return {
      meetingId: meeting.id,
      joinUrl: meeting.join_url,
      password: meeting.password,
      startUrl: meeting.start_url
    };
  } catch (error) {
    console.error('Zoom meeting creation failed:', error);
    throw new Error(`Failed to create Zoom meeting: ${error.message}`);
  }
}
```

### 4.3 Intégration Swiss Bitcoin Pay

#### 4.3.1 Configuration

L'intégration avec Swiss Bitcoin Pay nécessite:
- Un compte Swiss Bitcoin Pay
- Une clé API

Configuration dans le fichier `.env`:
```
SBP_API_KEY=your_api_key
SBP_API_URL=https://api.swissbitcoinpay.ch
SBP_WEBHOOK_BASE_URL=https://api.cryptocare.ch
```

#### 4.3.2 Exemple d'utilisation

```javascript
// integrations/bitcoin/invoice.js
const axios = require('axios');
const config = require('../../config/bitcoin');

/**
 * Crée une facture Bitcoin pour un rendez-vous
 * @param {Object} options - Options de la facture
 * @param {number} options.appointmentId - ID du rendez-vous
 * @param {number} options.amount - Montant en BTC
 * @param {string} options.description - Description
 * @returns {Promise<Object>} Détails de la facture
 */
async function createInvoice({ appointmentId, amount, description }) {
  try {
    const response = await axios.post(
      `${config.apiUrl}/invoices`,
      {
        amount_btc: amount,
        description,
        metadata: { appointmentId },
        webhook_url: `${config.webhookBaseUrl}/api/webhooks/bitcoin-payment`,
        expiry: 600 // 10 minutes
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      invoiceId: response.data.id,
      paymentRequest: response.data.payment_request,
      qrCode: response.data.qr_code,
      amount: response.data.amount_btc,
      status: response.data.status,
      expiresAt: response.data.expires_at
    };
  } catch (error) {
    console.error('Swiss Bitcoin Pay invoice creation failed:', error);
    throw new Error(`Failed to create invoice: ${error.response?.data?.message || error.message}`);
  }
}
```

## 5. Bases de données

### 5.1 Schema principal

Le schéma de base de données complet est disponible dans `/docs/db-schema.md`. Voici les tables principales:

#### 5.1.1 Tables principales

- **users**: Utilisateurs (patients et professionnels)
- **patients**: Informations spécifiques aux patients
- **professionals**: Informations spécifiques aux professionnels
- **specialties**: Spécialités médicales
- **availabilities**: Disponibilités des professionnels
- **appointments**: Rendez-vous
- **payments**: Paiements Bitcoin

#### 5.1.2 Relations

```
users 1──┐
         │
         ├─1 patients
         │
         └─1 professionals ─┐
                            │
                            ├─* availabilities
                            │
specialties 1─────────────┘
            │
            │                patients 1─┐
            │                           │
            └───* professionals 1─┐     │
                                  │     │
                                  └─* appointments *┘
                                        │
                                        └─1 payments
```

### 5.2 Migrations

Les migrations de base de données sont gérées avec Sequelize:

```javascript
// migrations/20250301000001-create-users.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_type: {
        type: Sequelize.ENUM('patient', 'professional', 'admin'),
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
```

### 5.3 Modèles Sequelize

```javascript
// models/user.js
'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Patient, {
        foreignKey: 'userId',
        as: 'patient'
      });
      User.hasOne(models.Professional, {
        foreignKey: 'userId',
        as: 'professional'
      });
    }
    
    async comparePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }
  
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
    },
    userType: {
      type: DataTypes.ENUM('patient', 'professional', 'admin'),
      allowNull: false,
      field: 'user_type'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });
  
  return User;
};
```

### 5.4 Seeders

```javascript
// seeders/20250301000001-demo-specialties.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('specialties', [
      {
        name: 'Médecine générale',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Dermatologie',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Psychologie',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Nutrition',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('specialties', null, {});
  }
};
```

## 6. Tests

### 6.1 Tests unitaires

#### 6.1.1 Backend (Jest)

```javascript
// services/__tests__/appointment.service.test.js
const { checkAvailability } = require('../appointment.service');
const { Appointment, Availability } = require('../../models');

// Mock des modèles Sequelize
jest.mock('../../models', () => ({
  Appointment: {
    findAll: jest.fn()
  },
  Availability: {
    findAll: jest.fn()
  }
}));

describe('Appointment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('checkAvailability', () => {
    it('should return true when slot is available', async () => {
      // Mock des données
      Appointment.findAll.mockResolvedValue([]);
      Availability.findAll.mockResolvedValue([{ id: 1 }]);
      
      const result = await checkAvailability(1, '2025-07-10', '14:00', '14:30');
      
      expect(result).toBe(true);
      expect(Appointment.findAll).toHaveBeenCalledTimes(1);
      expect(Availability.findAll).toHaveBeenCalledTimes(1);
    });
    
    it('should return false when there is a conflicting appointment', async () => {
      // Mock des données
      Appointment.findAll.mockResolvedValue([{ id: 1 }]);
      
      const result = await checkAvailability(1, '2025-07-10', '14:00', '14:30');
      
      expect(result).toBe(false);
      expect(Appointment.findAll).toHaveBeenCalledTimes(1);
      expect(Availability.findAll).not.toHaveBeenCalled();
    });
  });
});
```

#### 6.1.2 Frontend (Jest + React Testing Library)

```javascript
// components/__tests__/ProfessionalCard.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfessionalCard from '../ProfessionalCard';

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key })
}));

describe('ProfessionalCard', () => {
  const mockProfessional = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    specialty: { name: 'Dermatologie' }
  };
  
  const mockOnSelect = jest.fn();
  
  it('renders professional info correctly', () => {
    render(
      <ProfessionalCard 
        professional={mockProfessional}
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/Dermatologie/)).toBeInTheDocument();
  });
  
  it('calls onSelect when button is clicked', () => {
    render(
      <ProfessionalCard 
        professional={mockProfessional}
        onSelect={mockOnSelect}
      />
    );
    
    fireEvent.click(screen.getByText('select'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockProfessional);
  });
});
```

### 6.2 Tests d'intégration

```javascript
// api/__tests__/appointment.routes.test.js
const request = require('supertest');
const app = require('../../app');
const { User, Professional, Appointment } = require('../../models');
const { generateToken } = require('../../utils/auth');

describe('Appointment API', () => {
  let patientToken;
  let professionalToken;
  let testPatient;
  let testProfessional;
  
  beforeAll(async () => {
    // Créer utilisateurs de test
    testPatient = await User.create({
      email: 'patient@test.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'Patient',
      userType: 'patient'
    });
    
    const proUser = await User.create({
      email: 'pro@test.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'Professional',
      userType: 'professional'
    });
    
    testProfessional = await Professional.create({
      userId: proUser.id,
      specialtyId: 1
    });
    
    // Générer tokens
    patientToken = generateToken(testPatient);
    professionalToken = generateToken(proUser);
  });
  
  afterAll(async () => {
    // Nettoyage
    await Appointment.destroy({ where: {} });
    await Professional.destroy({ where: {} });
    await User.destroy({ where: {} });
  });
  
  describe('POST /api/appointments', () => {
    it('should create a new appointment', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          professionalId: testProfessional.id,
          date: '2025-07-10',
          startTime: '14:00',
          endTime: '14:30'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.professionalId).toBe(testProfessional.id);
      expect(response.body.patientId).toBe(testPatient.id);
      expect(response.body.status).toBe('scheduled');
    });
    
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .send({
          professionalId: testProfessional.id,
          date: '2025-07-10',
          startTime: '14:00',
          endTime: '14:30'
        });
      
      expect(response.status).toBe(401);
    });
  });
});
```

### 6.3 Tests de bout en bout (E2E)

#### 6.3.1 Web (Cypress)

```javascript
// cypress/integration/appointment_booking.spec.js
describe('Appointment Booking', () => {
  beforeEach(() => {
    // Login avant chaque test
    cy.login('patient@test.com', 'password123');
  });
  
  it('should allow booking an appointment', () => {
    // Visiter la page de recherche
    cy.visit('/professionals');
    
    // Rechercher un professionnel
    cy.get('[data-testid="specialty-select"]').select('Dermatologie');
    cy.get('[data-testid="search-button"]').click();
    
    // Sélectionner le premier professionnel
    cy.get('[data-testid="professional-card"]').first().click();
    
    // Sélectionner un créneau disponible
    cy.get('[data-testid="available-slot"]').first().click();
    
    // Confirmer le rendez-vous
    cy.get('[data-testid="confirm-button"]').click();
    
    // Vérifier la redirection vers la page de paiement
    cy.url().should('include', '/payment');
    cy.get('[data-testid="qr-code"]').should('be.visible');
    
    // Simuler un paiement réussi (pour les tests seulement)
    cy.window().then(win => {
      win.mockPaymentSuccess();
    });
    
    // Vérifier la confirmation
    cy.get('[data-testid="success-message"]').should('be.visible');
    cy.get('[data-testid="zoom-link"]').should('be.visible');
  });
});
```

#### 6.3.2 Mobile (Detox)

```javascript
// e2e/appointment.test.js
describe('Appointment Booking Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    await loginAsPatient();
  });
  
  it('should allow booking an appointment', async () => {
    // Naviguer vers la recherche
    await element(by.id('tab-professionals')).tap();
    
    // Sélectionner une spécialité
    await element(by.id('specialty-picker')).tap();
    await element(by.text('Dermatologie')).tap();
    
    // Rechercher
    await element(by.id('search-button')).tap();
    
    // Sélectionner un professionnel
    await element(by.id('professional-item-0')).tap();
    
    // Sélectionner un créneau
    await element(by.id('slot-item-0')).tap();
    
    // Confirmer
    await element(by.id('confirm-button')).tap();
    
    // Vérifier la page de paiement
    await expect(element(by.id('payment-screen'))).toBeVisible();
    await expect(element(by.id('qr-code'))).toBeVisible();
    
    // Simuler un paiement (mock)
    await device.executeScript('mockPaymentSuccess()');
    
    // Vérifier la confirmation
    await expect(element(by.id('success-message'))).toBeVisible();
    await expect(element(by.id('zoom-link-button'))).toBeVisible();
  });
});
```

## 7. Déploiement

### 7.1 Environnements

| Environnement | URL | Description |
|---------------|-----|-------------|
| Local | http://localhost:3000 | Développement local |
| Dev | https://dev-app.cryptocare.ch | Intégration continue |
| Staging | https://staging-app.cryptocare.ch | Tests avant production |
| Production | https://app.cryptocare.ch | Production |

### 7.2 Pipeline CI/CD (GitHub Actions)

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: cryptocare_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      # Backend tests
      - name: Install backend dependencies
        run: cd backend && npm install
      
      - name: Run backend linting
        run: cd backend && npm run lint
      
      - name: Run backend tests
        run: cd backend && npm test
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_NAME: cryptocare_test
          DB_USER: postgres
          DB_PASSWORD: postgres
          JWT_SECRET: test_secret
      
      # Frontend tests
      - name: Install frontend dependencies
        run: cd frontend && npm install
      
      - name: Run frontend linting
        run: cd frontend && npm run lint
      
      - name: Run frontend tests
        run: cd frontend && npm test -- --coverage
  
  deploy-dev:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      # ... étapes de déploiement en dev ...
  
  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      # ... étapes de déploiement en production ...
```

### 7.3 Déploiement en production

#### 7.3.1 Backend

Le backend est déployé sur DigitalOcean avec PM2:

```bash
# Script de déploiement
#!/bin/bash
set -e

cd /var/www/cryptocare-backend

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Run migrations
npx sequelize-cli db:migrate

# Restart services
pm2 reload ecosystem.config.js --env production
```

#### 7.3.2 Frontend

Le frontend est déployé comme une application statique sur DigitalOcean App Platform:

1. Build de l'application React
2. Déploiement des fichiers statiques
3. Configuration du CDN et de la mise en cache

## 8. Sécurité

### 8.1 Bonnes pratiques

- **Validation des entrées**: Toutes les entrées utilisateur doivent être validées
- **Paramètres préparés**: Utiliser des requêtes paramétrées pour éviter les injections SQL
- **Sanitization**: Nettoyer les entrées HTML/JS pour éviter les XSS
- **HTTPS**: Toutes les communications sont chiffrées
- **CSRF**: Protection contre les attaques CSRF
- **Rate limiting**: Limiter les tentatives de connexion et les requêtes API
- **Headers sécurisés**: CSP, X-XSS-Protection, etc.

### 8.2 Gestion des secrets

- Ne jamais stocker de secrets dans le code source
- Utiliser des variables d'environnement
- Considérer un gestionnaire de secrets pour la production (Vault, AWS Secrets Manager)

### 8.3 Authentification

```javascript
// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/auth');

/**
 * Middleware d'authentification
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required'
        }
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Vérifier l'existence de l'utilisateur
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Attacher l'utilisateur à la requête
      req.user = user;
      
      next();
    } catch (error) {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
```

## 9. Résolution des problèmes courants

### 9.1 Problèmes d'installation

#### 9.1.1 Erreurs de dépendances

**Problème**: Erreurs de conflits de dépendances lors de l'installation

**Solution**:
```bash
# Supprimer node_modules et le fichier de verrouillage
rm -rf node_modules package-lock.json
# Réinstaller les dépendances
npm install
```

#### 9.1.2 Erreurs de base de données

**Problème**: Erreur de connexion à PostgreSQL

**Solution**:
```bash
# Vérifier que PostgreSQL est en cours d'exécution
sudo service postgresql status
# Vérifier les informations de connexion dans .env
# Tester la connexion manuellement
psql -h localhost -U postgres -d cryptocare_dev
```

### 9.2 Problèmes de développement

#### 9.2.1 Hot Reloading ne fonctionne pas

**Problème**: Les changements ne sont pas appliqués automatiquement

**Solution**:
```bash
# Pour le frontend
# Vérifier que le fichier .env.local contient:
FAST_REFRESH=true
# Redémarrer le serveur de développement
npm run start

# Pour le backend
# Vérifier que nodemon est correctement configuré
# Redémarrer avec:
npm run dev
```

#### 9.2.2 Erreurs CORS

**Problème**: Erreurs CORS dans la console du navigateur

**Solution**:
Vérifier la configuration CORS dans `backend/config/cors.js`
```javascript
// config/cors.js
module.exports = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://app.cryptocare.ch']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// app.js
const cors = require('cors');
const corsOptions = require('./config/cors');
app.use(cors(corsOptions));
```

### 9.3 Problèmes d'intégration

#### 9.3.1 Erreurs Zoom API

**Problème**: Échec de création de réunions Zoom

**Solution**:
1. Vérifier les identifiants API Zoom dans les variables d'environnement
2. Vérifier que le compte a les autorisations nécessaires
3. Examiner les logs d'erreur détaillés:
```bash
# Activer les logs détaillés pour l'intégration Zoom
LOG_LEVEL=debug npm run dev
# Examiner les logs dans la console ou dans les fichiers logs
```

#### 9.3.2 Erreurs Swiss Bitcoin Pay

**Problème**: Échec de création de factures Bitcoin

**Solution**:
1. Vérifier la clé API dans les variables d'environnement
2. S'assurer que le compte Swiss Bitcoin Pay est actif
3. Pour le développement, utiliser l'environnement testnet:
```
SBP_API_URL=https://api.testnet.swissbitcoinpay.ch
```

## 10. Ressources et liens utiles

### 10.1 Documentation officielle

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/master/)
- [Zoom API Documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/)
- [Swiss Bitcoin Pay API Documentation](https://docs.swissbitcoinpay.ch/)

### 10.2 Ressources internes

- [API Documentation](./docs/api-documentation.md)
- [Database Schema](./docs/db-schema.md)
- [Deployment Guide](./docs/deployment.md)
- [Testing Strategy](./docs/testing.md)

### 10.3 Canaux de support

- **Slack**: Canal #dev-support pour l'aide au développement
- **GitHub Issues**: Pour les bugs et demandes de fonctionnalités
- **Documentation Wiki**: Wiki interne pour les solutions connues

### 10.4 Communauté et contributions

- **Pull Requests**: Suivre les guidelines dans [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Code Reviews**: Chaque PR nécessite au moins une revue
- **Standups**: Réunions quotidiennes à 10h00 CET

## Annexes

### Annexe A: Glossaire

| Terme | Description |
|-------|-------------|
| CryptoCare | Plateforme de télémédecine avec paiement en Bitcoin |
| LN | Lightning Network, solution de paiement Bitcoin de second niveau |
| SBP | Swiss Bitcoin Pay, service de paiement Bitcoin |
| JWT | JSON Web Token, utilisé pour l'authentification |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete (opérations de base sur les données) |

### Annexe B: Checklist de développement

#### Avant de soumettre un PR:

- [ ] Le code suit les conventions de style
- [ ] Les tests unitaires passent
- [ ] Les tests d'intégration passent
- [ ] La documentation est à jour
- [ ] Les migrations de base de données sont correctes
- [ ] Pas de secrets exposés dans le code
- [ ] Le code a été revu par un pair

#### Avant un déploiement:

- [ ] Tests de non-régression effectués
- [ ] Compatibilité navigateur vérifiée
- [ ] Tests de performance effectués
- [ ] Sécurité validée
- [ ] Procédure de rollback préparée

### Annexe C: Configuration VSCode recommandée

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ],
  "javascript.updateImportsOnFileMove.enabled": "always",
  "editor.tabSize": 2,
  "prettier.singleQuote": true
}
```

## Conclusion

Cette documentation est conçue pour fournir à tous les développeurs travaillant sur CryptoCare les connaissances nécessaires pour contribuer efficacement au projet. Elle est destinée à évoluer avec le projet - n'hésitez pas à suggérer des améliorations via des pull requests.

Pour toute question ou clarification, contactez l'équipe de développement via Slack ou lors des standups quotidiens.

---

Dernière mise à jour: Février 2025# Documentation Développeur - CryptoCare

## Introduction

Cette documentation est destinée aux développeurs qui travaillent sur la plateforme CryptoCare. Elle fournit les informations nécessaires pour configurer l'environnement de développement, comprendre l'architecture du système et suivre les normes et pratiques recommandées.

## Table des matières

1. [Configuration de l'environnement](#1-configuration-de-lenvironnement)
2. [Architecture du projet](#2-architecture-du-projet)
3. [Guidelines de développement](#3-guidelines-de-développement)
4. [API et intégrations](#4-api-et-intégrations)
5. [Bases de données](#5-bases-de-données)
6. [Tests](#6-tests)
7. [Déploiement](#7-déploiement)
8. [Sécurité](#8-sécurité)
9. [Résolution des problèmes courants](#9-résolution-des-problèmes-courants)
10. [Ressources et liens utiles](#10-ressources-et-liens-utiles)

## 1. Configuration de l'environnement

### 1.1 Prérequis

- **Node.js** v16+ ([Télécharger](https://nodejs.org/))
- **npm** v8+ ou **yarn** v1.22+
- **PostgreSQL** v14+ ([Télécharger](https://www.postgresql.org/download/))
- **Git** ([Télécharger](https://git-scm.com/downloads))
- **Docker** et **Docker Compose** (optionnel, pour le développement conteneurisé)

### 1.2 Installation locale

#### 1.2.1 Cloner le dépôt

```bash
# Cloner le dépôt principal
git clone https://github.com/cryptocare-sa/cryptocare-platform.git
cd cryptocare-platform

# Initialiser les sous-modules (si applicable)
git submodule update --init --recursive
```

#### 1.2.2 Configurer le backend

```bash
# Se déplacer dans le répertoire backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer le fichier .env avec vos configurations locales
# Notamment les identifiants de base de données et les clés API
```

Configuration minimale de `.env` pour le développement:

```
# Serveur
PORT=4000
NODE_ENV=development

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cryptocare_dev
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT
JWT_SECRET=dev_secret_not_for_production
JWT_EXPIRATION=24h

# API Zoom (sandbox)
ZOOM_CLIENT_ID=your_sandbox_client_id
ZOOM_CLIENT_SECRET=your_sandbox_client_secret
ZOOM_ACCOUNT_ID=your_sandbox_account_id

# API Swiss Bitcoin Pay (testnet)
SBP_API_KEY=your_testnet_api_key
SBP_API_URL=https://api.testnet.swissbitcoinpay.ch
SBP_WEBHOOK_BASE_URL=https://localhost:4000
```

#### 1.2.3 Configurer le frontend

```bash
# Se déplacer dans le répertoire frontend
cd ../frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Éditer le fichier .env.local avec vos configurations
```

Configuration minimale de `.env.local` pour le développement:

```
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_ZOOM_SDK_KEY=your_zoom_sdk_key
REACT_APP_SBP_PUBLIC_KEY=your_sbp_public_key
```

#### 1.2.4 Configurer l'application mobile (optionnel)

```bash
# Se déplacer dans le répertoire mobile
cd ../mobile

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer le fichier .env avec vos configurations
```

### 1.3 Configuration avec Docker

Pour simplifier la configuration, vous pouvez utiliser Docker Compose:

```bash
# Depuis la racine du projet
docker-compose -f docker-compose.dev.yml up -d
```

Cela lancera:
- PostgreSQL sur le port 5432
- Le backend Node.js sur le port 4000
- Le frontend React sur le port 3000

Les volumes sont configurés pour la persistance des données et le hot-reloading du code.

## 2. Architecture du projet

### 2.1 Vue d'ensemble

CryptoCare suit une architecture client-serveur avec des composants découplés:

```
┌────────────────┐    ┌────────────────┐    ┌────────────────┐
│    Frontend    │    │    Backend     │    │  Base de       │
│   (React.js)   │◄──►│   (Node.js)    │◄──►│  données       │
└────────────────┘    └────────────────┘    │ (PostgreSQL)   │
                              │             └────────────────┘
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
┌──────▼─────┐        ┌───────▼────────┐      ┌─────▼──────┐
│ Mobile     │        │ Zoom           │      │ Swiss      │
│ (React     │        │ API            │      │ Bitcoin    │
│  Native)   │        │                │      │ Pay API    │
└────────────┘        └────────────────┘      └────────────┘
```

### 2.2 Composants principaux

#### 2.2.1 Frontend (React.js)

Le frontend est une application React.js qui utilise:
- **React Router** pour la navigation
- **Redux** pour la gestion d'état global
- **Axios** pour les requêtes API
- **i18next** pour l'internationalisation

#### 2.2.2 Backend (Node.js/Express)

Le backend est une API REST construite avec Node.js et Express qui:
- Expose des endpoints REST pour le frontend
- Gère l'authentification (JWT)
- Communique avec la base de données
- S'intègre avec Zoom et Swiss Bitcoin Pay

#### 2.2.3 Mobile (React Native)

L'application mobile est développée avec React Native et partage une grande partie de la logique métier avec le frontend web.

#### 2.2.4 Base de données (PostgreSQL)

La base de données relationnelle stocke toutes les données persistantes de l'application, à l'exception des données médicales.

### 2.3 Flux de données typiques

#### 2.3.1 Authentification

```sequence
Client->Backend: POST /api/auth/login (identifiants)
Backend->Base de données: Vérification des identifiants
Base de données->Backend: Utilisateur authentifié
Backend->Client: JWT token
Client->Client: Stockage du token dans localStorage
```

#### 2.3.2 Prise de rendez-vous et paiement

```sequence
Client->Backend: GET /api/professionals
Backend->Base de données: Récupération des pros
Backend->Client: Liste des professionnels
Client->Backend: GET /api/professionals/:id/availability
Backend->Base de données: Vérification des disponibilités
Backend->Client: Créneaux disponibles
Client->Backend: POST /api/appointments (création RDV)
Backend->Base de données: Enregistrement du RDV
Backend->Swiss Bitcoin Pay: Création facture
Swiss Bitcoin Pay->Backend: QR code + infos paiement
Backend->Client: Infos paiement + QR code
Client->Swiss Bitcoin Pay: Paiement Bitcoin
Swiss Bitcoin Pay->Backend: Webhook confirmation paiement
Backend->Zoom: Création réunion
Zoom->Backend: Lien Zoom
Backend->Base de données: Mise à jour RDV (confirmé + lien)
Backend->Client: Notification confirmation
```

## 3. Guidelines de développement

### 3.1 Structure des dossiers

#### 3.1.1 Frontend (React.js)

```
frontend/
├── public/             # Ressources statiques
│   ├── index.html      # Template HTML
│   ├── locales/        # Fichiers de traduction
│   └── assets/         # Images, icônes, etc.
├── src/
│   ├── api/            # Services API
│   ├── components/     # Composants React réutilisables
│   ├── context/        # Contextes React (Auth, etc.)
│   ├── hooks/          # Hooks personnalisés
│   ├── pages/          # Composants de pages
│   ├── redux/          # Store, actions, reducers
│   ├── routes/         # Configuration des routes
│   ├── styles/         # Styles globaux (SCSS)
│   ├── utils/          # Fonctions utilitaires
│   ├── App.js          # Composant racine
│   └── index.js        # Point d'entrée
└── package.json        # Dépendances
```

#### 3.1.2 Backend (Node.js/Express)

```
backend/
├── api/                # API REST
│   ├── controllers/    # Contrôleurs
│   ├── middlewares/    # Middlewares Express
│   ├── routes/         # Définition des routes
│   └── validators/     # Validation des requêtes
├── config/             # Configuration
├── db/                 # Couche d'accès aux données
│   ├── migrations/     # Migrations de base de données
│   ├── models/         # Modèles Sequelize
│   └── seeders/        # Données de test
├── integrations/       # Intégrations tierces
│   ├── zoom/           # Intégration Zoom
│   └── bitcoin/        # Intégration Swiss Bitcoin Pay
├── services/           # Services métier
├── utils/              # Utilitaires
├── app.js              # Configuration Express
└── server.js           # Point d'entrée du serveur
```

### 3.2 Conventions de code

#### 3.2.1 Règles générales

- **Indentation**: 2 espaces
- **Quotes**: Simples (`'`) pour JavaScript, doubles (`"`) pour JSX
- **Point-virgules**: Obligatoires
- **Nommage**:
  - Variables et fonctions: camelCase
  - Composants React: PascalCase
  - Fichiers de composants: PascalCase
  - Fichiers JS autres: kebab-case
  - Constantes: UPPER_SNAKE_CASE

#### 3.2.2 Configuration ESLint

Le projet utilise ESLint avec les configurations suivantes:

**.eslintrc.js (Frontend)**:
```javascript
module.exports = {
  extends: [
    'react-app',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['jsx-a11y', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/prefer-default-export': 'off'
  }
};
```

**.eslintrc.js (Backend)**:
```javascript
module.exports = {
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'node/exports-style': ['error', 'module.exports'],
    'node/no-unsupported-features/es-syntax': ['error', {
      version: '>=16.0.0',
      ignores: ['modules']
    }]
