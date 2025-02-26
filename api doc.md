# Documentation API - CryptoCare

## Introduction

Cette documentation décrit les endpoints de l'API RESTful qui alimente la plateforme CryptoCare. L'API est conçue pour être utilisée par les applications frontend (web et mobile) et permet l'accès aux fonctionnalités de télémédecine et de paiement en Bitcoin.

## Informations générales

- **Base URL**: `https://api.cryptocare.ch/api/v1`
- **Format**: JSON
- **Authentification**: JWT (JSON Web Token)
- **Versionnement**: Inclus dans l'URL (`/api/v1/...`)

## Authentification

L'API utilise l'authentification par token JWT. Pour accéder aux endpoints protégés, il est nécessaire d'inclure le token dans l'en-tête HTTP `Authorization` sous la forme `Bearer {token}`.

### Obtention du token

#### `POST /auth/login`

Permet d'obtenir un token d'authentification.

**Requête**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "user": {
    "id": 123,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "patient"
  }
}
```

**Erreurs**:
- 401 Unauthorized: Identifiants invalides
- 429 Too Many Requests: Trop de tentatives

### Rafraîchissement du token

#### `POST /auth/refresh`

Permet de rafraîchir un token existant avant expiration.

**Requête**:
Nécessite le header `Authorization: Bearer {token}`

**Réponse** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

## Utilisateurs

### Enregistrement

#### `POST /users/register`

Enregistre un nouvel utilisateur (patient ou professionnel).

**Requête**:
```json
{
  "email": "patient@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "patient",
  "phone": "+41791234567",
  "birthDate": "1985-05-15"
}
```

Pour les professionnels, des champs supplémentaires sont nécessaires:
```json
{
  "email": "doctor@example.com",
  "password": "Password123",
  "firstName": "Marie",
  "lastName": "Dupont",
  "userType": "professional",
  "phone": "+41791234568",
  "specialtyId": 1,
  "description": "Médecin généraliste avec 10 ans d'expérience",
  "zoomEmail": "doctor@example.com",
  "bitcoinAddress": "bc1q9h6..."
}
```

**Réponse** (201 Created):
```json
{
  "id": 124,
  "email": "patient@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "patient",
  "createdAt": "2025-03-15T14:32:21.943Z"
}
```

**Erreurs**:
- 400 Bad Request: Données invalides
- 409 Conflict: Email déjà utilisé

### Profil utilisateur

#### `GET /users/me`

Récupère le profil de l'utilisateur authentifié.

**Requête**:
Nécessite le header `Authorization: Bearer {token}`

**Réponse** (200 OK):
```json
{
  "id": 123,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "patient",
  "phone": "+41791234567",
  "birthDate": "1985-05-15",
  "createdAt": "2025-02-10T10:30:00.000Z",
  "updatedAt": "2025-03-15T14:32:21.943Z"
}
```

#### `PUT /users/me`

Met à jour le profil de l'utilisateur authentifié.

**Requête**:
Nécessite le header `Authorization: Bearer {token}`
```json
{
  "firstName": "Johnny",
  "phone": "+41791234569"
}
```

**Réponse** (200 OK):
```json
{
  "id": 123,
  "firstName": "Johnny",
  "lastName": "Doe",
  "phone": "+41791234569",
  "updatedAt": "2025-03-16T09:22:45.123Z"
}
```

## Professionnels

### Recherche de professionnels

#### `GET /professionals`

Recherche des professionnels selon divers critères.

**Paramètres de requête**:
- `specialtyId` (optionnel): ID de la spécialité
- `country` (optionnel): Pays (ex: "Switzerland", "France")
- `date` (optionnel): Date de disponibilité (format "YYYY-MM-DD")
- `page` (optionnel, défaut: 1): Numéro de page
- `limit` (optionnel, défaut: 10): Nombre de résultats par page

**Réponse** (200 OK):
```json
{
  "totalCount": 42,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": 234,
      "firstName": "Marie",
      "lastName": "Dupont",
      "specialty": {
        "id": 1,
        "name": "Médecine générale"
      },
      "description": "Médecin généraliste avec 10 ans d'expérience",
      "country": "Switzerland",
      "rating": 4.8,
      "reviewCount": 42,
      "consultationFee": 0.0005,
      "hasAvailabilityOnDate": true
    },
    // ...autres professionnels
  ]
}
```

### Détails d'un professionnel

#### `GET /professionals/:id`

Récupère les détails d'un professionnel spécifique.

**Réponse** (200 OK):
```json
{
  "id": 234,
  "firstName": "Marie",
  "lastName": "Dupont",
  "specialty": {
    "id": 1,
    "name": "Médecine générale"
  },
  "description": "Médecin généraliste avec 10 ans d'expérience",
  "country": "Switzerland",
  "languages": ["Français", "Anglais"],
  "education": "Université de Genève, 2010",
  "rating": 4.8,
  "reviewCount": 42,
  "consultationFee": 0.0005
}
```

### Disponibilités d'un professionnel

#### `GET /professionals/:id/availability`

Récupère les créneaux disponibles pour un professionnel.

**Paramètres de requête**:
- `startDate` (obligatoire): Date de début (format "YYYY-MM-DD")
- `endDate` (obligatoire): Date de fin (format "YYYY-MM-DD")

**Réponse** (200 OK):
```json
{
  "professionalId": 234,
  "availabilities": [
    {
      "date": "2025-07-07",
      "slots": [
        {
          "startTime": "09:00",
          "endTime": "09:30"
        },
        {
          "startTime": "10:00",
          "endTime": "10:30"
        },
        {
          "startTime": "14:00",
          "endTime": "14:30"
        }
      ]
    },
    {
      "date": "2025-07-08",
      "slots": [
        {
          "startTime": "09:00",
          "endTime": "09:30"
        },
        {
          "startTime": "11:00",
          "endTime": "11:30"
        }
      ]
    }
  ]
}
```

## Rendez-vous

### Création d'un rendez-vous

#### `POST /appointments`

Crée un nouveau rendez-vous.

**Requête**:
Nécessite le header `Authorization: Bearer {token}`
```json
{
  "professionalId": 234,
  "date": "2025-07-07",
  "startTime": "14:00",
  "endTime": "14:30"
}
```

**Réponse** (201 Created):
```json
{
  "id": 567,
  "professionalId": 234,
  "professional": {
    "firstName": "Marie",
    "lastName": "Dupont",
    "specialty": {
      "name": "Médecine générale"
    }
  },
  "patientId": 123,
  "date": "2025-07-07",
  "startTime": "14:00",
  "endTime": "14:30",
  "status": "scheduled",
  "createdAt": "2025-03-16T10:15:30.123Z"
}
```

**Erreurs**:
- 400 Bad Request: Données invalides ou créneau non disponible
- 403 Forbidden: L'utilisateur n'est pas un patient
- 404 Not Found: Professionnel non trouvé

### Liste des rendez-vous

#### `GET /appointments`

Récupère les rendez-vous de l'utilisateur authentifié.

**Paramètres de requête**:
- `status` (optionnel): Filtre par statut ("scheduled", "confirmed", "cancelled", "completed")
- `startDate` (optionnel): Date de début (format "YYYY-MM-DD")
- `endDate` (optionnel): Date de fin (format "YYYY-MM-DD")
- `page` (optionnel, défaut: 1): Numéro de page
- `limit` (optionnel, défaut: 10): Nombre de résultats par page

**Réponse** (200 OK):
```json
{
  "totalCount": 5,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": 567,
      "professional": {
        "id": 234,
        "firstName": "Marie",
        "lastName": "Dupont",
        "specialty": {
          "name": "Médecine générale"
        }
      },
      "date": "2025-07-07",
      "startTime": "14:00",
      "endTime": "14:30",
      "status": "confirmed",
      "zoomMeetingUrl": "https://zoom.us/j/123456789",
      "createdAt": "2025-03-16T10:15:30.123Z"
    },
    // ...autres rendez-vous
  ]
}
```

### Détails d'un rendez-vous

#### `GET /appointments/:id`

Récupère les détails d'un rendez-vous spécifique.

**Réponse** (200 OK):
```json
{
  "id": 567,
  "professional": {
    "id": 234,
    "firstName": "Marie",
    "lastName": "Dupont",
    "specialty": {
      "id": 1,
      "name": "Médecine générale"
    },
    "phone": "+41791234568"
  },
  "patient": {
    "id": 123,
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+41791234567"
  },
  "date": "2025-07-07",
  "startTime": "14:00",
  "endTime": "14:30",
  "status": "confirmed",
  "zoomMeetingId": "123456789",
  "zoomMeetingUrl": "https://zoom.us/j/123456789",
  "payment": {
    "id": 789,
    "amount": 0.0005,
    "status": "paid",
    "paidAt": "2025-03-16T10:20:15.456Z"
  },
  "createdAt": "2025-03-16T10:15:30.123Z",
  "updatedAt": "2025-03-16T10:20:15.456Z"
}
```

### Annulation d'un rendez-vous

#### `DELETE /appointments/:id`

Annule un rendez-vous spécifique.

**Requête**:
Nécessite le header `Authorization: Bearer {token}`

**Réponse** (200 OK):
```json
{
  "id": 567,
  "status": "cancelled",
  "updatedAt": "2025-03-16T11:30:45.789Z"
}
```

**Erreurs**:
- 400 Bad Request: Annulation impossible (délai dépassé)
- 403 Forbidden: L'utilisateur n'est pas associé à ce rendez-vous
- 404 Not Found: Rendez-vous non trouvé

## Paiements

### Création d'une facture Bitcoin

#### `POST /payments/invoice`

Crée une facture Bitcoin pour un rendez-vous.

**Requête**:
Nécessite le header `Authorization: Bearer {token}`
```json
{
  "appointmentId": 567
}
```

**Réponse** (201 Created):
```json
{
  "id": 789,
  "appointmentId": 567,
  "amount": 0.0005,
  "invoiceId": "sbp_inv_123456",
  "paymentRequest": "lnbc5m1pvjluezsp5...",
  "qrCodeUrl": "https://api.cryptocare.ch/qr/lnbc5m1pvjluezsp5...",
  "status": "pending",
  "expiresAt": "2025-03-16T10:25:30.123Z",
  "createdAt": "2025-03-16T10:15:30.123Z"
}
```

**Erreurs**:
- 400 Bad Request: Rendez-vous déjà payé ou annulé
- 404 Not Found: Rendez-vous non trouvé
- 500 Internal Server Error: Erreur lors de la génération de la facture

### Vérification du statut d'un paiement

#### `GET /payments/status/:invoiceId`

Vérifie le statut d'un paiement Bitcoin.

**Réponse** (200 OK):
```json
{
  "invoiceId": "sbp_inv_123456",
  "status": "paid",
  "paidAt": "2025-03-16T10:20:15.456Z"
}
```

**Erreurs**:
- 404 Not Found: Facture non trouvée

### Historique des paiements

#### `GET /payments/history`

Récupère l'historique des paiements de l'utilisateur authentifié.

**Paramètres de requête**:
- `startDate` (optionnel): Date de début (format "YYYY-MM-DD")
- `endDate` (optionnel): Date de fin (format "YYYY-MM-DD")
- `status` (optionnel): Filtre par statut ("pending", "paid", "expired", "refunded")
- `page` (optionnel, défaut: 1): Numéro de page
- `limit` (optionnel, défaut: 10): Nombre de résultats par page

**Réponse** (200 OK):
```json
{
  "totalCount": 3,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": 789,
      "appointmentId": 567,
      "appointment": {
        "date": "2025-07-07",
        "startTime": "14:00",
        "professional": {
          "firstName": "Marie",
          "lastName": "Dupont",
          "specialty": {
            "name": "Médecine générale"
          }
        }
      },
      "amount": 0.0005,
      "status": "paid",
      "paidAt": "2025-03-16T10:20:15.456Z",
      "createdAt": "2025-03-16T10:15:30.123Z"
    },
    // ...autres paiements
  ]
}
```

## Intégration Zoom

### Génération d'un lien de réunion

#### `POST /zoom/meetings`

Génère un lien de réunion Zoom pour un rendez-vous confirmé.

**Requête**:
Nécessite le header `Authorization: Bearer {token}`
```json
{
  "appointmentId": 567
}
```

**Réponse** (201 Created):
```json
{
  "appointmentId": 567,
  "zoomMeetingId": "123456789",
  "zoomMeetingUrl": "https://zoom.us/j/123456789",
  "startUrl": "https://zoom.us/s/123456789?zak=...",
  "joinUrl": "https://zoom.us/j/123456789",
  "password": "123456",
  "startTime": "2025-07-07T14:00:00.000Z",
  "duration": 30
}
```

**Erreurs**:
- 400 Bad Request: Rendez-vous non confirmé ou déjà lié à une réunion
- 403 Forbidden: L'utilisateur n'est pas associé à ce rendez-vous
- 404 Not Found: Rendez-vous non trouvé
- 500 Internal Server Error: Erreur lors de la création de la réunion Zoom

## Données de référence

### Liste des spécialités

#### `GET /specialties`

Récupère la liste des spécialités médicales.

**Réponse** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "name": "Médecine générale"
    },
    {
      "id": 2,
      "name": "Dermatologie"
    },
    {
      "id": 3,
      "name": "Psychologie"
    },
    {
      "id": 4,
      "name": "Nutrition"
    },
    // ...autres spécialités
  ]
}
```

### Liste des pays supportés

#### `GET /countries`

Récupère la liste des pays supportés par la plateforme.

**Réponse** (200 OK):
```json
{
  "data": [
    {
      "code": "CH",
      "name": "Switzerland"
    },
    {
      "code": "FR",
      "name": "France"
    }
    // ...autres pays
  ]
}
```

## Webhooks

### Webhook de paiement Bitcoin

#### `POST /webhooks/bitcoin-payment`

Endpoint pour recevoir les notifications de paiement de Swiss Bitcoin Pay.

**Requête**:
```json
{
  "event": "payment.confirmed",
  "invoiceId": "sbp_inv_123456",
  "paymentHash": "ab12cd34ef56gh78ij90...",
  "amount": 0.0005,
  "paidAt": "2025-03-16T10:20:15.456Z"
}
```

**Réponse**: 200 OK

### Webhook Zoom

#### `POST /webhooks/zoom-meeting`

Endpoint pour recevoir les notifications d'événements Zoom.

**Requête**:
```json
{
  "event": "meeting.started",
  "payload": {
    "account_id": "...",
    "object": {
      "id": "123456789",
      "host_id": "...",
      "topic": "Consultation médicale",
      "type": 2,
      "start_time": "2025-07-07T14:00:00Z",
      "duration": 30,
      "timezone": "Europe/Zurich"
    }
  }
}
```

**Réponse**: 200 OK

## Gestion des erreurs

### Format des erreurs

Toutes les réponses d'erreur suivent le même format:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Description détaillée de l'erreur",
    "details": {
      "field": ["Message d'erreur spécifique au champ"]
    }
  }
}
```

### Codes d'erreur communs

- `AUTHENTICATION_REQUIRED`: Authentification requise
- `INVALID_TOKEN`: Token invalide ou expiré
- `PERMISSION_DENIED`: Droits insuffisants
- `RESOURCE_NOT_FOUND`: Ressource non trouvée
- `INVALID_INPUT`: Données d'entrée invalides
- `RESOURCE_CONFLICT`: Conflit de ressources
- `RATE_LIMIT_EXCEEDED`: Limite de requêtes dépassée
- `INTERNAL_SERVER_ERROR`: Erreur serveur interne

## Pagination

Les endpoints qui retournent des listes de données supportent la pagination avec les paramètres suivants:

- `page`: Numéro de page (commence à 1)
- `limit`: Nombre d'éléments par page (défaut: 10, max: 100)

La réponse inclut toujours les métadonnées de pagination:

```json
{
  "totalCount": 42,  // Nombre total d'éléments
  "page": 2,         // Page courante
  "limit": 10,       // Limite par page
  "totalPages": 5,   // Nombre total de pages
  "data": [...]      // Données de la page
}
```

## Limites de débit

L'API applique les limites de débit suivantes:

- Endpoints publics: 100 requêtes par minute par IP
- Endpoints authentifiés: 300 requêtes par minute par utilisateur
- Endpoints sensibles (paiement, authentification): 10 requêtes par minute par utilisateur

Les en-têtes suivants sont inclus dans chaque réponse:
- `X-RateLimit-Limit`: Limite de requêtes par minute
- `X-RateLimit-Remaining`: Nombre de requêtes restantes
- `X-RateLimit-Reset`: Timestamp Unix de réinitialisation du compteur

## Considérations de sécurité

- Toutes les communications doivent utiliser HTTPS
- Les tokens JWT expirent après 24 heures
- Les informations sensibles (mots de passe, identifiants Zoom) ne sont jamais exposées via l'API
- L'API utilise les standards OWASP pour la protection contre les attaques courantes
- Les tentatives d'authentification sont limitées pour éviter les attaques par force brute

## Environnements

- Production: `https://api.cryptocare.ch/api/v1`
- Staging: `https://staging-api.cryptocare.ch/api/v1`
- Développement: `https://dev-api.cryptocare.ch/api/v1`

## Compatibilité et versionnement

Cette documentation concerne la version 1 de l'API. Les futures versions majeures (v2, v3, etc.) seront accessibles via des URLs distinctes. La compatibilité ascendante est garantie au sein d'une même version majeure.

Processus de dépréciation:
1. Annonce 6 mois avant la dépréciation
2. Ajout d'en-têtes de dépréciation
3. Période de support parallèle
4. Retrait de la version dépréciée
