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
