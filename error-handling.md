# Gestion des Erreurs et Exceptions - CryptoCare

## Introduction

Ce document définit la stratégie de gestion des erreurs et exceptions pour la plateforme CryptoCare. Une gestion efficace des erreurs est essentielle pour garantir une expérience utilisateur fluide, surtout dans le contexte d'une application traitant des paiements Bitcoin et des téléconsultations médicales où la fiabilité est primordiale.

## 1. Principes de base

### 1.1 Philosophie générale

- **Transparence**: Communiquer clairement les erreurs aux utilisateurs
- **Récupération**: Permettre à l'utilisateur de poursuivre son parcours quand c'est possible
- **Proactivité**: Anticiper et prévenir les erreurs potentielles
- **Traçabilité**: Enregistrer toutes les erreurs pour analyse et amélioration
- **Sécurité**: Ne jamais exposer d'informations sensibles dans les messages d'erreur

### 1.2 Types d'erreurs

| Type d'erreur | Description | Approche générale |
|---------------|-------------|-------------------|
| Erreurs utilisateur | Saisies incorrectes, actions invalides | Feedback immédiat, guidage |
| Erreurs d'application | Bugs, défauts logiques | Capture, journalisation, récupération gracieuse |
| Erreurs réseau | Problèmes de connectivité | Détection, retry automatique, mode hors ligne quand possible |
| Erreurs serveur | Problèmes d'infrastructure backend | Fallback, circuit breaker, communication transparente |
| Erreurs d'intégration | Problèmes avec Zoom, Swiss Bitcoin Pay | Voies alternatives, communication claire |

## 2. Architecture de gestion des erreurs

### 2.1 Frontend (Web et Mobile)

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Composant UI  │───►│ Error Boundary │───►│ Error Handler │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ UI Feedback   │    │ Error Logger  │    │ Error Recovery│
└───────────────┘    └───────────────┘    └───────────────┘
```

#### 2.1.1 Composants React Error Boundary

**Web (React)**:
```jsx
class GlobalErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    // Log to monitoring service
    errorLoggingService.logError(error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

**Mobile (React Native)**:
```jsx
import { ErrorBoundary } from 'react-native-error-boundary';

function App() {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, stackTrace) => errorLoggingService.logError(error, stackTrace)}
    >
      <MainApp />
    </ErrorBoundary>
  );
}
```

#### 2.1.2 Service de gestion des erreurs HTTP

```javascript
// api.service.js
class ApiService {
  async request(url, options) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        // Transformer les erreurs HTTP en erreurs JS structurées
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.error?.code || 'UNKNOWN_ERROR',
          errorData.error?.message || 'Une erreur inconnue est survenue'
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Erreurs réseau ou autres
      if (!navigator.onLine) {
        throw new ApiError(0, 'NETWORK_OFFLINE', 'Vous êtes actuellement hors ligne');
      }
      
      throw new ApiError(0, 'NETWORK_ERROR', 'Problème de connexion au serveur');
    }
  }
}
```

### 2.2 Backend (Node.js/Express)

#### 2.2.1 Middleware de gestion des erreurs

```javascript
// error-handler.middleware.js
const errorHandler = (err, req, res, next) => {
  // Journalisation de l'erreur
  logger.error({
    message: err.message,
    stack: err.stack,
    code: err.code,
    userId: req.user?.id,
    path: req.path,
    method: req.method,
    requestId: req.id
  });
  
  // Déterminer le code HTTP approprié
  let statusCode = err.statusCode || 500;
  
  // Structure de réponse normalisée
  const response = {
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Une erreur interne est survenue'
        : err.message,
      requestId: req.id
    }
  };
  
  // Inclure des détails supplémentaires en développement
  if (process.env.NODE_ENV !== 'production') {
    response.error.stack = err.stack;
    response.error.details = err.details;
  }
  
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
```

#### 2.2.2 Erreurs métier standardisées

```javascript
// business-errors.js
class BusinessError extends Error {
  constructor(code, message, statusCode = 400, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ResourceNotFoundError extends BusinessError {
  constructor(resource, id, message = null) {
    super(
      'RESOURCE_NOT_FOUND',
      message || `${resource} avec l'identifiant ${id} est introuvable`,
      404
    );
    this.resource = resource;
    this.resourceId = id;
  }
}

class ValidationError extends BusinessError {
  constructor(validationErrors, message = 'Données invalides') {
    super('VALIDATION_ERROR', message, 400, validationErrors);
  }
}

// Autres types d'erreurs spécifiques...

module.exports = {
  BusinessError,
  ResourceNotFoundError,
  ValidationError,
  // ...
};
```

#### 2.2.3 Utilisation dans les contrôleurs

```javascript
// appointment.controller.js
const { ResourceNotFoundError, ValidationError } = require('../errors/business-errors');

const createAppointment = async (req, res, next) => {
  try {
    const { professionalId, date, startTime, endTime } = req.body;
    
    // Validation
    const errors = validateAppointmentData(req.body);
    if (errors) {
      throw new ValidationError(errors);
    }
    
    // Vérifier l'existence du professionnel
    const professional = await Professional.findByPk(professionalId);
    if (!professional) {
      throw new ResourceNotFoundError('Professional', professionalId);
    }
    
    // Vérifier la disponibilité
    const isAvailable = await checkAvailability(professionalId, date, startTime, endTime);
    if (!isAvailable) {
      throw new BusinessError(
        'SLOT_UNAVAILABLE',
        'Ce créneau n\'est plus disponible',
        409
      );
    }
    
    // Créer le rendez-vous
    const appointment = await Appointment.create({
      professionalId,
      patientId: req.user.id,
      date,
      startTime,
      endTime,
      status: 'scheduled'
    });
    
    res.status(201).json(appointment);
  } catch (error) {
    next(error); // Passe l'erreur au middleware de gestion d'erreurs
  }
};
```

## 3. Scénarios critiques et stratégies de récupération

### 3.1 Échec de paiement Bitcoin

#### 3.1.1 Types d'erreurs possibles

| Erreur | Cause | Solution |
|--------|-------|----------|
| Timeout de paiement | Utilisateur n'a pas payé dans le délai | Régénérer une facture, conserver le rendez-vous en statut "en attente" |
| Erreur de création facture | API Swiss Bitcoin Pay indisponible | Réessai automatique (3x), proposer paiement différé |
| Paiement partiel | Montant incorrect envoyé | Demander complément, support manuel |
| Problème Lightning Network | Problème sur le réseau | Canal alternatif, paiement on-chain comme fallback |

#### 3.1.2 Flux de récupération pour timeout de paiement

```
┌────────────────┐     ┌───────────────┐     ┌────────────────┐     ┌───────────────┐
│ QR Code expiré │────►│ Notification  │────►│ Proposition de │────►│ Nouvelle      │
│                │     │ utilisateur   │     │ régénération   │     │ facture       │
└────────────────┘     └───────────────┘     └────────────────┘     └───────────────┘
```

**Implémentation**:
```javascript
async function handleExpiredInvoice(invoiceId, appointmentId) {
  // 1. Marquer la facture comme expirée
  await Payment.update({ status: 'expired' }, { where: { invoiceId } });
  
  // 2. Conserver le rendez-vous
  await Appointment.update(
    { paymentStatus: 'pending' },
    { where: { id: appointmentId } }
  );
  
  // 3. Notifier l'utilisateur (in-app et email)
  const appointment = await Appointment.findByPk(appointmentId, {
    include: [{ model: User, as: 'patient' }]
  });
  
  await notificationService.send({
    userId: appointment.patient.id,
    type: 'PAYMENT_EXPIRED',
    data: { appointmentId }
  });
  
  return { appointmentId, canRetry: true };
}
```

### 3.2 Problèmes d'intégration Zoom

#### 3.2.1 Types d'erreurs possibles

| Erreur | Cause | Solution |
|--------|-------|----------|
| Échec création réunion | API Zoom indisponible | Réessai planifié, notification au patient et professionnel |
| Token Zoom expiré | Problème d'authentification | Rafraîchissement automatique du token, retry |
| Erreur paramètres | Données incorrectes envoyées à Zoom | Validation préalable, paramètres par défaut |
| Rate limiting | Trop de requêtes à l'API Zoom | File d'attente avec backoff exponentiel |

#### 3.2.2 Stratégie de fallback Zoom

```javascript
async function createZoomMeeting(appointmentId) {
  const appointment = await Appointment.findByPk(appointmentId, {
    include: [
      { model: User, as: 'patient' },
      { model: Professional, include: [{ model: User }] }
    ]
  });
  
  try {
    // Tentative de création via l'API Zoom
    const zoomMeeting = await zoomService.createMeeting({
      topic: `Consultation médicale`,
      startTime: `${appointment.date}T${appointment.startTime}`,
      duration: 30,
      timezone: 'Europe/Zurich',
      settings: {
        join_before_host: false,
        waiting_room: true
      }
    });
    
    await appointment.update({
      zoomMeetingId: zoomMeeting.id,
      zoomJoinUrl: zoomMeeting.join_url
    });
    
    return zoomMeeting;
  } catch (error) {
    logger.error('Zoom meeting creation failed', { appointmentId, error });
    
    // Stratégie de fallback: lien de réunion générique avec mot de passe
    const fallbackCode = generateSecureCode();
    const fallbackUrl = `https://zoom.us/j/${process.env.FALLBACK_ROOM_ID}?pwd=${fallbackCode}`;
    
    await appointment.update({
      zoomMeetingId: null,
      zoomJoinUrl: fallbackUrl,
      zoomPassword: fallbackCode,
      zoomFallbackUsed: true
    });
    
    // Notification spéciale pour les utilisateurs
    await notificationService.send({
      userId: appointment.patient.id,
      type: 'ZOOM_FALLBACK',
      data: { appointmentId, fallbackUrl, password: fallbackCode }
    });
    
    await notificationService.send({
      userId: appointment.professional.User.id,
      type: 'ZOOM_FALLBACK',
      data: { appointmentId, fallbackUrl, password: fallbackCode }
    });
    
    return { joinUrl: fallbackUrl, password: fallbackCode };
  }
}
```

### 3.3 Gestion des conflits de rendez-vous

#### 3.3.1 Détection proactive des conflits

```javascript
async function checkForConflicts(professionalId, date, startTime, endTime) {
  // Vérifier si le créneau est toujours disponible
  const existingAppointments = await Appointment.findAll({
    where: {
      professionalId,
      date,
      status: { [Op.notIn]: ['cancelled'] },
      [Op.or]: [
        {
          // Chevauchement: nouveau RDV commence pendant un existant
          [Op.and]: [
            { startTime: { [Op.lte]: startTime } },
            { endTime: { [Op.gt]: startTime } }
          ]
        },
        {
          // Chevauchement: nouveau RDV se termine pendant un existant
          [Op.and]: [
            { startTime: { [Op.lt]: endTime } },
            { endTime: { [Op.gte]: endTime } }
          ]
        },
        {
          // Chevauchement: nouveau RDV englobe un existant
          [Op.and]: [
            { startTime: { [Op.gte]: startTime } },
            { endTime: { [Op.lte]: endTime } }
          ]
        }
      ]
    }
  });
  
  if (existingAppointments.length > 0) {
    return {
      hasConflict: true,
      conflictingAppointments: existingAppointments,
      alternativeSlots: await findAlternativeSlots(professionalId, date)
    };
  }
  
  return { hasConflict: false };
}
```

#### 3.3.2 Gestion de la concurrence (verrouillage optimiste)

```javascript
// middleware/optimistic-lock.js
const optimisticLock = (model, findOptions) => async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Obtenir l'entité avec verrouillage pour mise à jour
    const entity = await model.findOne({
      ...findOptions(req),
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    
    if (!entity) {
      await transaction.rollback();
      return next(new ResourceNotFoundError(model.name, 'unknown'));
    }
    
    // Attacher l'entité et la transaction à la requête
    req.lockedEntity = entity;
    req.transaction = transaction;
    
    // Middleware suivant
    next();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Utilisation
router.post(
  '/appointments/:id/confirm',
  optimisticLock(Appointment, req => ({
    where: { id: req.params.id, status: 'scheduled' }
  })),
  appointmentController.confirmAppointment
);
```

## 4. Messages d'erreur et expérience utilisateur

### 4.1 Principes de conception des messages

- **Clarté**: Messages simples et compréhensibles
- **Contexte**: Expliquer pourquoi l'erreur s'est produite
- **Action**: Indiquer clairement la marche à suivre
- **Ton**: Rassurant et constructif, jamais accusatoire
- **Cohérence**: Style et format cohérents dans toute l'application

### 4.2 Bibliothèque de messages d'erreur

```javascript
// error-messages.js
const errorMessages = {
  // Erreurs d'authentification
  'AUTH_INVALID_CREDENTIALS': {
    title: 'Identifiants incorrects',
    message: 'L\'adresse email ou le mot de passe est incorrect.',
    action: 'Veuillez vérifier vos identifiants et réessayer.'
  },
  'AUTH_ACCOUNT_LOCKED': {
    title: 'Compte temporairement bloqué',
    message: 'Votre compte a été temporairement bloqué suite à plusieurs tentatives de connexion infructueuses.',
    action: 'Veuillez réessayer dans 15 minutes ou utiliser la fonction "Mot de passe oublié".'
  },
  
  // Erreurs de paiement
  'PAYMENT_FAILED': {
    title: 'Échec du paiement',
    message: 'Le paiement n\'a pas pu être traité.',
    action: 'Veuillez vérifier votre portefeuille Bitcoin et réessayer.'
  },
  'PAYMENT_EXPIRED': {
    title: 'Paiement expiré',
    message: 'Le délai de paiement est dépassé.',
    action: 'Vous pouvez générer une nouvelle facture pour confirmer votre rendez-vous.'
  },
  'PAYMENT_INSUFFICIENT': {
    title: 'Montant insuffisant',
    message: 'Le montant payé est inférieur au montant requis.',
    action: 'Veuillez contacter notre support pour résoudre ce problème.'
  },
  
  // Erreurs de rendez-vous
  'APPOINTMENT_UNAVAILABLE': {
    title: 'Créneau indisponible',
    message: 'Ce créneau n\'est plus disponible.',
    action: 'Veuillez sélectionner un autre horaire parmi les créneaux proposés.'
  },
  'APPOINTMENT_ZOOM_FAILED': {
    title: 'Problème de création du lien Zoom',
    message: 'Nous n\'avons pas pu générer un lien Zoom spécifique.',
    action: 'Un lien alternatif vous a été envoyé par email.'
  },
  
  // Erreurs réseau
  'NETWORK_OFFLINE': {
    title: 'Vous êtes hors ligne',
    message: 'Vous n\'êtes pas connecté à Internet.',
    action: 'Veuillez vérifier votre connexion et réessayer.'
  },
  'NETWORK_ERROR': {
    title: 'Problème de connexion',
    message: 'Impossible de se connecter au serveur.',
    action: 'Veuillez vérifier votre connexion ou réessayer plus tard.'
  },
  
  // Erreurs génériques
  'INTERNAL_SERVER_ERROR': {
    title: 'Erreur interne',
    message: 'Une erreur inattendue s\'est produite.',
    action: 'Notre équipe technique a été notifiée. Veuillez réessayer plus tard.'
  }
};
```

### 4.3 Composants UI pour les erreurs

#### 4.3.1 Composant d'alerte d'erreur

```jsx
// ErrorAlert.jsx
function ErrorAlert({ error, onRetry, onDismiss }) {
  const errorInfo = errorMessages[error.code] || {
    title: 'Erreur',
    message: error.message || 'Une erreur s\'est produite.',
    action: 'Veuillez réessayer ultérieurement.'
  };
  
  return (
    <div className="error-alert">
      <div className="error-alert__icon">
        <ExclamationIcon />
      </div>
      <div className="error-alert__content">
        <h4 className="error-alert__title">{errorInfo.title}</h4>
        <p className="error-alert__message">{errorInfo.message}</p>
        <p className="error-alert__action">{errorInfo.action}</p>
      </div>
      <div className="error-alert__actions">
        {onRetry && (
          <button className="btn btn-secondary" onClick={onRetry}>
            Réessayer
          </button>
        )}
        {onDismiss && (
          <button className="btn btn-text" onClick={onDismiss}>
            Fermer
          </button>
        )}
      </div>
    </div>
  );
}
```

#### 4.3.2 Page d'erreur globale

```jsx
// ErrorPage.jsx
function ErrorPage({ error, resetError }) {
  const errorInfo = errorMessages[error.code] || {
    title: 'Erreur inattendue',
    message: 'Une erreur inattendue s\'est produite.',
    action: 'Vous pouvez essayer de rafraîchir la page ou revenir à l\'accueil.'
  };
  
  return (
    <div className="error-page">
      <img 
        src="/images/error-illustration.svg" 
        alt="Illustration d'erreur" 
        className="error-page__illustration" 
      />
      <h1 className="error-page__title">{errorInfo.title}</h1>
      <p className="error-page__message">{errorInfo.message}</p>
      <p className="error-page__action">{errorInfo.action}</p>
      <div className="error-page__buttons">
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>
          Rafraîchir la page
        </button>
        <Link to="/" className="btn btn-primary" onClick={resetError}>
          Retour à l'accueil
        </Link>
      </div>
      {error.code && (
        <div className="error-page__technical">
          Code d'erreur: <code>{error.code}</code>
          {error.requestId && <span> · Référence: {error.requestId}</span>}
        </div>
      )}
    </div>
  );
}
```

#### 4.3.3 Feedback en temps réel sur les formulaires

```jsx
// FormField.jsx
function FormField({ label, name, error, ...props }) {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      <label htmlFor={name} className="form-field__label">
        {label}
      </label>
      <input 
        id={name}
        name={name}
        className="form-field__input"
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {error && (
        <div className="form-field__error" role="alert">
          <ErrorIcon size="small" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
```

## 5. Journalisation et monitoring

### 5.1 Structure des logs d'erreur

```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'cryptocare-api' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

const errorLogger = {
  log: (error, context = {}) => {
    logger.error({
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      stack: error.stack,
      ...context,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = { logger, errorLogger };
```

### 5.2 Alertes et monitoring

```javascript
// monitoring.js
const { errorLogger } = require('./logger');
const { sendSlackAlert } = require('./slack');

// Seuils d'alerte
const ERROR_THRESHOLDS = {
  PAYMENT_FAILED: { count: 5, timeWindow: 60 * 5 }, // 5 en 5 minutes
  ZOOM_INTEGRATION_ERROR: { count: 3, timeWindow: 60 * 5 }, // 3 en 5 minutes
  GENERAL_ERROR: { count: 10, timeWindow: 60 * 5 } // 10 en 5 minutes
};

// Cache pour le comptage des erreurs
const errorCounts = {
  // code: [{ timestamp, count }, ...]
};

const monitorError = (error, context) => {
  // Journalisation standard
  errorLogger.log(error, context);
  
  const errorCode = error.code || 'GENERAL_ERROR';
  const now = Date.now();
  
  // Initialiser le compteur si nécessaire
  if (!errorCounts[errorCode]) {
    errorCounts[errorCode] = [];
  }
  
  // Ajouter l'erreur au compteur
  errorCounts[errorCode].push({ timestamp: now, count: 1 });
  
  // Nettoyer les entrées trop anciennes
  const threshold = ERROR_THRESHOLDS[errorCode] || ERROR_THRESHOLDS.GENERAL_ERROR;
  const timeWindow = threshold.timeWindow * 1000; // convertir en ms
  errorCounts[errorCode] = errorCounts[errorCode].filter(
    entry => (now - entry.timestamp) < timeWindow
  );
  
  // Calculer le nombre total d'erreurs dans la fenêtre de temps
  const totalCount = errorCounts[errorCode].reduce((sum, entry) => sum + entry.count, 0);
  
  // Vérifier si le seuil est dépassé
  if (totalCount >= threshold.count) {
    // Déclencher une alerte
    sendSlackAlert({
      type: 'ERROR_THRESHOLD',
      errorCode,
      count: totalCount,
      timeWindow: threshold.timeWindow / 60, // en minutes
      sample: {
        message: error.message,
        context
      }
    });
    
    // Réinitialiser le compteur pour éviter les alertes répétées
    errorCounts[errorCode] = [];
  }
};

module.exports = { monitorError };
```

### 5.3 Tableau de bord des erreurs

Un tableau de bord d'erreurs sera implémenté avec:
- Distribution des erreurs par type
- Tendances temporelles des erreurs
- Erreurs affectant le plus d'utilisateurs
- Mesures de l'impact (consultations manquées, paiements échoués)
- Temps moyen de résolution

## 6. Tests et prévention

### 6.1 Tests automatisés pour les scénarios d'erreur

```javascript
// appointment.test.js
describe('Gestion des rendez-vous - scénarios d\'erreur', () => {
  test('Devrait gérer un conflit de rendez-vous', async () => {
    // Créer un rendez-vous existant
    const existingAppointment = await createTestAppointment({
      professionalId: testProfessional.id,
      date: '2025-07-10',
      startTime: '14:00',
      endTime: '14:30'
    });
    
    // Tenter de créer un rendez-vous au même moment
    const response = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${testPatientToken}`)
      .send({
        professionalId: testProfessional.id,
        date: '2025-07-10',
        startTime: '14:00',
        endTime: '14:30'
      });
    
    // Vérifier la réponse d'erreur
    expect(response.status).toBe(409);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toBe('APPOINTMENT_UNAVAILABLE');
    
    // Vérifier que des créneaux alternatifs sont proposés
    expect(response.body.alternativeSlots).toBeDefined();
    expect(response.body.alternativeSlots.length).toBeGreaterThan(0);
  });
  
  test('Devrait gérer une indisponibilité de l\'API Zoom', async () => {
    // Mock de l'API Zoom pour simuler une erreur
    jest.spyOn(zoomService, 'createMeeting').mockRejectedValue(
      new Error('Zoom API unavailable')
    );
    
    // Créer un rendez-vous et tenter de générer un lien Zoom
    const appointment = await createTestAppointment();
    
    const response = await request(app)
      .post(`/api/zoom/meetings`)
      .set('Authorization', `Bearer ${testProfessionalToken}`)
      .send({ appointmentId: appointment.id });
    
    // Vérifier que le fallback est utilisé
    expect(response.status).toBe(200);
    expect(response.body.zoomFallbackUsed).toBe(true);
    expect(response.body.zoomJoinUrl).toBeDefined();
    expect(response.body.zoomPassword).toBeDefined();
    
    // Vérifier que des notifications sont envoyées
    expect(notificationService.send).toHaveBeenCalledTimes(2);
  });
});
```

### 6.2 Chaos engineering et tests de résilience

Pour les fonctionnalités critiques, des tests de résilience seront mis en place:

1. **Simulation d'échecs API**: Tester le comportement avec les services externes indisponibles
2. **Latence artificielle**: Vérifier les timeouts et la dégradation gracieuse
3. **Injection d'erreurs en production**: Sur un petit pourcentage de requêtes non critiques
4. **Tests de charge**: Vérifier le comportement sous stress

## 7. Plan de communication des erreurs

### 7.1 Communication aux utilisateurs

| Type d'incident | Canal | Délai | Contenu |
|-----------------|-------|-------|---------|
| Maintenance planifiée | Email, In-app, Site web | 48h avant | Date, durée, impact |
| Panne majeure en cours | Bannière, Status page | 15 min | Description, ETA, workarounds |
| Incident résolu | Email, In-app | 2h après | Résumé, impact, mesures prises |
| Problème affectant un utilisateur | Email, In-app | Immédiat | Description, étapes suivantes |

### 7.2 Modèles de communication

#### 7.2.1 Notification de maintenance

```html
<div class="maintenance-notice">
  <h3>Maintenance planifiée</h3>
  <p>
    Afin d'améliorer nos services, une maintenance sera effectuée le <strong>{date}</strong> 
    de <strong>{startTime}</strong> à <strong>{endTime}</strong>.
  </p>
  <p>
    Pendant cette période, les fonctionnalités suivantes seront temporairement indisponibles:
  </p>
  <ul>
    {#each features as feature}
      <li>{feature}</li>
    {/each}
  </ul>
  <p>
    Les consultations déjà confirmées ne seront pas affectées.
    Nous nous excusons pour tout désagrément et vous remercions de votre compréhension.
  </p>
</div>
```

#### 7.2.2 Notification d'incident

```html
<div class="incident-alert">
  <h3>Perturbation en cours</h3>
  <p>
    Nous rencontrons actuellement des difficultés avec <strong>{service}</strong>.
    Nos équipes techniques travaillent activement à résoudre ce problème.
  </p>
  <p>
    Impact: <strong>{impact}</strong>
  </p>
  <p>
    Solution temporaire: {workaround}
  </p>
  <p>
    Dernière mise à jour: {lastUpdate}
  </p>
</div>
```

## 8. Procédures opérationnelles

### 8.1 Escalade des incidents

```
Niveau 1: Support client
  │
  ▼
Niveau 2: Support technique
  │
  ▼
Niveau 3: Ingénieurs de garde
  │
  ▼
Niveau 4: Responsables techniques
  │
  ▼
Niveau 5: Direction
```

### 8.2 Runbook pour les erreurs critiques

#### 8.2.1 Problèmes de paiement Bitcoin

1. Vérifier le statut de Swiss Bitcoin Pay dans le dashboard de monitoring
2. Vérifier les logs des transactions récentes
3. Contacter l'équipe Swiss Bitcoin Pay si problème persistant
4. Activer le mode de paiement différé si nécessaire
5. Communiquer aux utilisateurs via bannière in-app

#### 8.2.2 Problèmes d'intégration Zoom

1. Vérifier le statut de l'API Zoom
2. Vérifier les tokens d'authentification
3. Activer le système de salle de réunion générique
4. Envoyer des instructions manuelles si nécessaire
5. Surveiller les prochains rendez-vous à risque

## 9. Amélioration continue

### 9.1 Analyse post-mortem des incidents

Après chaque incident majeur, une analyse post-mortem sera effectuée:

1. **Chronologie**: Séquence détaillée des événements
2. **Impact**: Utilisateurs affectés, durée, services touchés
3. **Cause principale**: Analyse des causes techniques et organisationnelles
4. **Détection**: Comment l'incident a été détecté
5. **Résolution**: Actions prises pour résoudre l'incident
6. **Prévention**: Mesures pour éviter que ce problème ne se reproduise
7. **Amélioration processus**: Comment améliorer la réponse aux incidents

### 9.2 Boucle de feedback

1. Collecter les retours utilisateurs suite aux erreurs
2. Analyser les erreurs les plus fréquentes et impactantes
3. Prioriser les améliorations basées sur ces données
4. Implémenter des corrections et améliorations
5. Mesurer l'impact des modifications

## Conclusion

Cette stratégie de gestion des erreurs et exceptions constitue un élément fondamental de l'expérience utilisateur de CryptoCare. En anticipant les problèmes potentiels et en mettant en place des mécanismes robustes de détection, récupération et communication, nous visons à créer une plateforme résiliente qui inspire confiance, même en cas de difficultés techniques.

Les principes clés à retenir:
- Transparence et clarté dans la communication des erreurs
- Proactivité dans la détection et la prévention
- Récupération gracieuse avec des alternatives viables
- Amélioration continue basée sur l'analyse des incidents

Ce document évoluera au fur et à mesure du développement de la plateforme et de l'identification de nouveaux scénarios d'erreur potentiels.
